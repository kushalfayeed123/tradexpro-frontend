// state/transactions.state.ts

import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError, of, forkJoin, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FetchTransactions, SelectTransaction, ClearSelectedTransaction, ApproveTransaction, ReverseTransaction, RejectTransaction } from './transaction.action';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { SetLoading } from '../../../../auth/state/auth.actions';

export interface TransactionsStateModel {
    list: any[];
    selected: any | null;
    meta: any;
    loading: boolean;
    stats: any | null; // Added for top-level stats
}

@State<TransactionsStateModel>({
    name: 'transactions',
    defaults: {
        list: [],
        selected: null,
        meta: { page: 1, limit: 10, total: 0 },
        loading: false,
        stats: null
    }
})
@Injectable()
export class TransactionsState {
    private service = inject(TransactionsService); // Use your service here


    @Selector()
    static list(state: TransactionsStateModel) { return state.list; }

    @Selector()
    static selected(state: TransactionsStateModel) { return state.selected; }

    @Selector()
    static meta(state: TransactionsStateModel) { return state.meta; }


    @Selector()
    static stats(state: TransactionsStateModel) { return state.stats; }

    @Selector()
    static loading(state: TransactionsStateModel) { return state.loading; }


    @Action(FetchTransactions)
    fetch(ctx: StateContext<TransactionsStateModel>, action: FetchTransactions) {
        ctx.patchState({ loading: true });

        const params: any = {
            page: action.payload?.page || 1,
            limit: action.payload?.limit || 10,
        };
        if (action.payload?.type && action.payload.type !== 'all') params.type = action.payload.type;
        if (action.payload?.search) params.search = action.payload.search;

        // Fetch both the table list and the dashboard stats
        return forkJoin({
            transactions: this.service.getTransactions(params),
            stats: this.service.getStats()
        }).pipe(
            tap(({ transactions, stats }) => {
                ctx.patchState({
                    list: transactions.data,
                    meta: transactions.meta,
                    stats: stats, // Store the response from backend getStats()
                    loading: false
                });
            }),
            catchError((err) => {
                ctx.patchState({ loading: false });
                return of(err);
            })
        );
    }

    @Action(SelectTransaction)
    select(ctx: StateContext<TransactionsStateModel>, { payload }: SelectTransaction) {
        ctx.patchState({ selected: payload });
    }

    @Action(ClearSelectedTransaction)
    clear(ctx: StateContext<TransactionsStateModel>) {
        ctx.patchState({ selected: null });
    }

    // Add these to your state/transaction.action.ts file first:
    // export class ApproveTransaction { static readonly type = '[Transactions] Approve'; constructor(public id: string) {} }
    // export class ReverseTransaction { static readonly type = '[Transactions] Reverse'; constructor(public id: string) {} }

    @Action(ApproveTransaction)
    approve(ctx: StateContext<TransactionsStateModel>, { id }: ApproveTransaction) {
        ctx.dispatch(new SetLoading(true));

        return this.service.approveTransaction(id).pipe(
            tap(() => {
                ctx.dispatch(new FetchTransactions(ctx.getState().meta));
                ctx.patchState({ selected: null });
            }),
            catchError((err) => {

                return of(err);
            }),
            finalize(() => {
                // This runs on both success and error
                ctx.dispatch(new SetLoading(false));
            })
        );
    }

    @Action(ReverseTransaction)
    reverse(ctx: StateContext<TransactionsStateModel>, { id }: ReverseTransaction) {
        ctx.dispatch(new SetLoading(true));

        return this.service.reverseTransaction(id).pipe(
            tap(() => {
                ctx.dispatch(new FetchTransactions(ctx.getState().meta));
                ctx.patchState({ selected: null });
            }),
            catchError((err) => {
                return of(err);
            }),
            finalize(() => ctx.dispatch(new SetLoading(false)))
        );
    }

    @Action(RejectTransaction)
    reject(ctx: StateContext<TransactionsStateModel>, { id }: RejectTransaction) {
        ctx.dispatch(new SetLoading(true));

        return this.service.rejectTransaction(id).pipe(
            tap(() => {
                ctx.dispatch(new FetchTransactions(ctx.getState().meta));
                ctx.patchState({ selected: null });
            }),
            catchError((err) => {
                return of(err);
            }),
            finalize(() => ctx.dispatch(new SetLoading(false)))
        );
    }
}