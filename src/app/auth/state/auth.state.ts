import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InitializeAuth, Login, Logout, SetLoading, UpdateUser, VerifyOtp } from './auth.actions';
import { User } from '../../common/models/user.model';
import { AuthApiService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

export interface AuthStateModel {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

/** * SSR Safe Helper: 
 * Only attempts to access localStorage if running in the browser.
 */
const getSafeItem = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null;
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: getSafeItem('access_token'),
    user: JSON.parse(getSafeItem('user_data') || 'null'),
    isLoading: false
  }
})
@Injectable()
export class AuthState {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthApiService);
  private notify = inject(NotificationService);
  private router = inject(Router);


  // --- Selectors ---

  @Selector()
  static token(state: AuthStateModel) { return state.token; }

  @Selector()
  static user(state: AuthStateModel) { return state.user; }

  @Selector()
  static isLoading(state: AuthStateModel) { return state.isLoading; }

  @Selector()
  static isAuthenticated(state: AuthStateModel) { return !!state.token; }

  @Selector()
  static role(state: AuthStateModel) { return state.user?.role; }

  // --- Actions ---

  @Action(VerifyOtp)
  verifyOtp(ctx: StateContext<AuthStateModel>, action: VerifyOtp) {
    // 1. Set loading to true
    ctx.dispatch(new SetLoading(true));

    // 2. Call the API
    // We use from() if verifyOtp returns a Promise, or just the observable
    return this.authService.verifyOtp(action.userId, action.code).then(
      (response: any) => {
        // 3. Success logic
        // If your backend returns the updated user, update state here
        const state = ctx.getState();
        if (state.user && state.user.id === action.userId) {
          ctx.patchState({
            user: { ...state.user, is_verified: true }
          });
        }

        ctx.dispatch(new SetLoading(false));
      },
      (error: any) => {
        // 4. Error logic
        ctx.dispatch(new SetLoading(false));
        throw error; // Re-throw so the component can catch it for the notification
      }
    );
  }

  @Action(SetLoading)
  setLoading(ctx: StateContext<AuthStateModel>, { isLoading }: SetLoading) {
    ctx.patchState({ isLoading });
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { payload }: Login) {
    // Only persist to disk if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', payload.token);
      localStorage.setItem('user_data', JSON.stringify(payload.user));
    }

    ctx.patchState({
      token: payload.token,
      user: payload.user
    });
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<AuthStateModel>, { user }: UpdateUser) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    ctx.patchState({ user });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const platformId = inject(PLATFORM_ID);

    // 1. Wipe the browser storage
    if (isPlatformBrowser(platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }

    // 2. Reset the state to defaults
    ctx.setState({
      token: null,
      user: null,
      isLoading: false
    });

    // 3. Show a toast and redirect
    this.notify.show('Logged out successfully', 'success');
    this.router.navigate(['/login']);
  }

  @Action(InitializeAuth)
  async initializeAuth(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();

    // If no token exists, there's nothing to rehydrate
    if (!state.token) return;

    try {
      ctx.patchState({ isLoading: true });

      // Call the 'me' endpoint to get fresh data (role, balance, etc.)
      const { user } = await this.authService.checkSession();

      // Update the state with the latest user data from DB
      ctx.patchState({ user, isLoading: false });

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    } catch (error) {
      // If the token is invalid or expired, the interceptor will handle the 401,
      // but we clear the state here as a fallback.
      ctx.dispatch(new Logout());
    } finally {
      ctx.patchState({ isLoading: false });
    }
  }
}