import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, finalize, catchError, of } from 'rxjs';
import { SetLoading } from '../../../../auth/state/auth.actions';
import { InvestmentsService } from '../../../../core/services/investment.service';
import { FetchAllInvestments, MatureInvestment } from './investments.actions';


export interface InvestmentStateModel {
    list: any[];
    loading: boolean;
    meta: { total: number; page: number; totalPages: number };

}

@State<InvestmentStateModel>({
    name: 'investmentplan',
    defaults: { list: [], loading: false, meta: { total: 0, page: 1, totalPages: 1 } }
})
@Injectable()
export class InvestmentState {
    private service = inject(InvestmentsService);

    @Selector()
    static list(state: InvestmentStateModel) { return state.list; }

    @Selector()
    static meta(state: InvestmentStateModel) { return state.meta; }

    @Action(FetchAllInvestments)
    fetch(ctx: StateContext<InvestmentStateModel>, action: FetchAllInvestments) {
        ctx.patchState({ loading: true });

        // Pass the params from the action to the service
        return this.service.getAll(action.params).pipe(
            tap((res: any) => {
                ctx.patchState({
                    list: res.data,
                    meta: res.meta
                });
            }),
            finalize(() => ctx.patchState({ loading: false }))
        );
    }

    @Action(MatureInvestment)
    mature(ctx: StateContext<InvestmentStateModel>, { id }: MatureInvestment) {
        ctx.dispatch(new SetLoading(true));
        return this.service.mature(id).pipe(
            tap(() => {
                ctx.dispatch(new FetchAllInvestments());
            }),
            catchError(err => {
                console.error('Maturity failed', err);
                return of(err);
            }),
            finalize(() => ctx.dispatch(new SetLoading(false)))
        );
    }
}