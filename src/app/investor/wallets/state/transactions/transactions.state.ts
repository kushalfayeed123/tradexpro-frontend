import { Injectable, inject } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { catchError, of, tap, throwError } from "rxjs";
import { NotificationService } from "../../../../core/services/notification.service";
import { CreateTransaction, FetchUserTransactions } from "./transactions.actions";
import { TransactionsService } from "../../../../core/services/transactions.service";
import { AuthState } from "../../../../auth/state/auth.state";
import { SetLoading } from "../../../../auth/state/auth.actions";

export interface UserTransactionsStateModel {
    list: any[];
    selected: any | null;
    methods: [];
    lastCreated: any | null
    meta: any;
    loading: boolean;
}



@State<UserTransactionsStateModel>({
    name: 'investortransactions',
    defaults: {
        methods: [],
        lastCreated: null,
        list: [],
        selected: undefined,
        meta: undefined,
        loading: false,
    }
})
@Injectable()
export class InvestorTransactionState {
    private api = inject(TransactionsService);
    private notify = inject(NotificationService);



    @Selector()
    static getTransactions(state: UserTransactionsStateModel) {
        return state.list;
    }

    @Selector()
    static getPendingTransactions(state: UserTransactionsStateModel) {
        return state.list.filter(t => t.status === 'pending');
    }

    @Action(CreateTransaction)
    create(ctx: StateContext<any>, { payload }: CreateTransaction) {
        ctx.dispatch(new SetLoading(true));
        return this.api.createTransaction(payload).pipe(
            tap({
                next: (stats) => {
                    ctx.dispatch(new SetLoading(false));
                    this.notify.show('Transaction submitted for review', 'success');
                },
                error: () => {
                    ctx.dispatch(new SetLoading(false));
                    this.notify.show('An error occurred', 'error');

                }
            })

        );
    }

    @Action(FetchUserTransactions)
    fetch(ctx: StateContext<UserTransactionsStateModel>, action: FetchUserTransactions) {
        ctx.patchState({ loading: true });

        const params: any = {
            page: action.payload?.page || 1,
            limit: action.payload?.limit || 10,
        };
        if (action.payload?.type && action.payload.type !== 'all') params.type = action.payload.type;
        if (action.payload?.search) params.search = action.payload.search;



        return this.api.getInvestorTransactions(params).pipe(
            tap((res: any) => {
                // Based on your JSON: { "data": [...], "status": 200, ... }
                console.log('API Response:', res);

                ctx.patchState({
                    list: res.data || [],       // Use res.data, not transactions.data
                    meta: res.meta || null,     // Adjust based on if your API actually sends 'meta'
                    loading: false
                });
            }),
            catchError((err) => {
                ctx.patchState({ loading: false });
                return throwError(() => err); // Better to use throwError in catchError
            })
        );
    }
}