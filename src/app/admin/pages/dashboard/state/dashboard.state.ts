// state/admin.state.ts
import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { ClearAdminState, GetDashboardSummary } from './dashboard.actions';
import { OverviewService } from '../../../../core/services/investment-overview.service';

export interface AdminStateModel {
    summary: {
        metrics: {
            total_aum: number;
            active_investors: number;
            pending_kyc_total: number;
            inflow_24h: number;
            outflow_24h: number;
        };
        recent_transactions: any[];
        liquidity: {
            available_usd: number;
            reserved_usd: number;
        };
    } | null;
    loading: boolean;
}

@State<AdminStateModel>({
    name: 'admin',
    defaults: {
        summary: null,
        loading: false
    }
})
@Injectable()
export class AdminState {
    private service = inject(OverviewService);

    @Selector()
    static summary(state: AdminStateModel) { return state.summary; }

    @Selector()
    static isLoading(state: AdminStateModel) { return state.loading; }

    @Action(GetDashboardSummary)
    getSummary(ctx: StateContext<AdminStateModel>) {
        ctx.patchState({ loading: true });

        // Replace with your actual NestJS endpoint
        return this.service.getAdminDashboardSummary().pipe(
            tap((data) => {
                ctx.patchState({
                    summary: data,
                    loading: false
                });
            }),
            finalize(() => ctx.patchState({ loading: false }))
        );
    }

    @Action(ClearAdminState)
    clearState(ctx: StateContext<AdminStateModel>) {
        ctx.setState({
            summary: null,
            loading: false
        });
    }
}