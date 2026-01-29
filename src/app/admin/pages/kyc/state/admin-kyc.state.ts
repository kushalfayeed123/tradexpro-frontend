import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs';
import { KycService } from '../../../../core/services/kyc.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { GetPendingKycs, ReviewKyc } from './admin-kyc.actions';
import { SetLoading } from '../../../../auth/state/auth.actions';

export interface AdminKycStateModel {
    list: any[];
    loading: boolean;
    meta: { total: number; page: number; totalPages: number };
}

@State<AdminKycStateModel>({
    name: 'adminkyc',
    defaults: {
        list: [],
        loading: false,
        meta: { total: 0, page: 1, totalPages: 1 }
    }
})
@Injectable()
export class AdminKycState {
    private service = inject(KycService);
    private notify = inject(NotificationService);

    @Selector()
    static list(state: AdminKycStateModel) { return state.list; }

    @Selector()
    static loading(state: AdminKycStateModel) { return state.loading; }

    @Action(GetPendingKycs)
    getPending(ctx: StateContext<AdminKycStateModel>) {
        ctx.patchState({ loading: true });
        return this.service.getAllPendingKycs().pipe(
            tap(adminQueue => ctx.patchState({
                list: adminQueue,
                loading: false
            })),
            catchError(err => {
                ctx.patchState({ loading: false });
                this.notify.show('Failed to load KYC queue');
                throw err;
            })
        );
    }

    @Action(ReviewKyc)
    review(ctx: StateContext<AdminKycStateModel>, action: ReviewKyc) {
        ctx.patchState({ loading: true });
        ctx.dispatch(new SetLoading(true));
        // Use the new service method that matches your ReviewKycDto
        return this.service.reviewKyc(action.kycId, action.decision, action.reason).pipe(
            tap(() => {
                ctx.dispatch(new SetLoading(false));

                this.notify.show(`User KYC ${action.decision} successfully`);
                ctx.dispatch(new GetPendingKycs());
            }),
            catchError(err => {
                ctx.dispatch(new SetLoading(false));

                ctx.patchState({ loading: false });
                this.notify.show(err.error?.message || 'Review submission failed');
                throw err;
            })
        );
    }
}