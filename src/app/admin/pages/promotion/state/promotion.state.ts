import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, forkJoin } from 'rxjs';
import { PromotionService } from '../../../../core/services/promotion.service';
import { LoadAdminPromoData, CreateAdminCoupon } from './promotion.action';


export interface AdminPromoStateModel {
  referrals: any[];
  stats: any | null;
  loading: boolean;
}

@State<AdminPromoStateModel>({
  name: 'adminPromo',
  defaults: { referrals: [], stats: null, loading: false }
})
@Injectable()
export class AdminPromoState {
  private api = inject(PromotionService);

  @Selector() static referrals(state: AdminPromoStateModel) { return state.referrals; }
  @Selector() static stats(state: AdminPromoStateModel) { return state.stats; }

  @Action(LoadAdminPromoData)
  loadData(ctx: StateContext<AdminPromoStateModel>) {
    ctx.patchState({ loading: true });
    return forkJoin({
      stats: this.api.getGlobalStats(),
      referrals: this.api.getAllReferrals()
    }).pipe(
      tap(res => ctx.patchState({ ...res, loading: false }))
    );
  }

  @Action(CreateAdminCoupon)
  createCoupon(ctx: StateContext<AdminPromoStateModel>, { payload }: CreateAdminCoupon) {
    return this.api.createCoupon(payload).pipe(
      tap(() => ctx.dispatch(new LoadAdminPromoData())) // Refresh data
    );
  }
}