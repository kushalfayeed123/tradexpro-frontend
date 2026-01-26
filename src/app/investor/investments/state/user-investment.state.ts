// my-investments.state.ts
import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FetchMyInvestments, SelectInvestment } from './user-investment.actions';
import { InvestmentsService } from '../../../core/services/investment.service';
import { SetLoading } from '../../../auth/state/auth.actions';

export interface MyInvestmentsStateModel {
    items: any[];
    selectedItem: any | null;
    loading: boolean;
    error: string | null;
}

@State<MyInvestmentsStateModel>({
    name: 'myInvestments',
    defaults: {
        items: [],
        selectedItem: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class MyInvestmentsState {
    private investService = inject(InvestmentsService);

    @Selector()
    static getInvestments(state: MyInvestmentsStateModel) {
        return state.items;
    }

    @Selector()
    static getActiveInvestments(state: MyInvestmentsStateModel) {
        return state.items.filter(i => i.status === 'active');
    }

    @Selector()
    static isLoading(state: MyInvestmentsStateModel) {
        return state.loading;
    }

    @Action(FetchMyInvestments)
    fetch(ctx: StateContext<MyInvestmentsStateModel>) {
        ctx.dispatch(new SetLoading(true))
        ctx.patchState({ loading: true, error: null });

        return this.investService.getUserInvestments().pipe(
            tap((items: any) => {
                ctx.dispatch(new SetLoading(false))

                ctx.patchState({
                    items,
                    loading: false
                });
            }),
            catchError((err) => {
                ctx.dispatch(new SetLoading(false))

                ctx.patchState({
                    loading: false,
                    error: err.message || 'Failed to load portfolio'
                });
                return of([]);
            })
        );
    }

    @Action(SelectInvestment)
    select(ctx: StateContext<MyInvestmentsStateModel>, { payload }: SelectInvestment) {
        const state = ctx.getState();
        const item = state.items.find(i => i.id === payload);
        ctx.patchState({ selectedItem: item });
    }
}