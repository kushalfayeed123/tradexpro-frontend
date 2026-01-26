import { Injectable, inject } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { NotificationService } from "../../../../core/services/notification.service";
import { CreateTransaction } from "./transactions.actions";
import { TransactionsService } from "../../../../core/services/transactions.service";
import { AuthState } from "../../../../auth/state/auth.state";
import { SetLoading } from "../../../../auth/state/auth.actions";

@State<any>({
    name: 'investortransactions',
    defaults: { methods: [], lastCreated: null }
})
@Injectable()
export class InvestorTransactionState {
    private api = inject(TransactionsService);
    private notify = inject(NotificationService);



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
}