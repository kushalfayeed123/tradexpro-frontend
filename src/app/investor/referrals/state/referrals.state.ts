// referral.state.ts
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoadReferralStats } from './referrals.actions';
import { PromotionService } from '../../../core/services/promotion.service';

export interface ReferralStateModel {
    stats: {
        referralCode: string;
        totalEarned: number;
        pendingCount: number;
        successfulCount: number;
    } | null;
    loading: boolean;
}

@State<ReferralStateModel>({
    name: 'referral',
    defaults: {
        stats: null,
        loading: false
    }
})
@Injectable()
export class ReferralState {
    private promoService = inject(PromotionService);

    @Selector()
    static stats(state: ReferralStateModel) { return state.stats; }

    @Selector()
    static loading(state: ReferralStateModel) { return state.loading; }

    @Action(LoadReferralStats)
    loadStats(ctx: StateContext<ReferralStateModel>, { userId }: LoadReferralStats) {
        ctx.patchState({ loading: true });

        // Using the service method we defined earlier
        return this.promoService.getReferralStats(userId).pipe(
            tap((stats: any) => {
                ctx.patchState({
                    stats,
                    loading: false
                });
            })
        );
    }
}