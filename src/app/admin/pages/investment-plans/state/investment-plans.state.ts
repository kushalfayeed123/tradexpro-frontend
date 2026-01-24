import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { SetLoading } from '../../../../auth/state/auth.actions';
import { InvestmentPlansService } from '../../../../core/services/investment-plans.service';
import { FetchPlans, SavePlan } from './investment-plans.actions';


export interface InvestmentStateModel {
    plans: any[];
    selected: any | null;
    loading: boolean;
}

@State<InvestmentStateModel>({
    name: 'investments',
    defaults: { plans: [], loading: false, selected: null }
})
@Injectable()
export class InvestmentPlansState {
    private service = inject(InvestmentPlansService);

    @Selector()
    static plans(state: InvestmentStateModel) { return state.plans; }

    @Action(FetchPlans)
    fetch(ctx: StateContext<InvestmentStateModel>) {
        ctx.patchState({ loading: true });
        return this.service.findAll().pipe(
            tap(plans => ctx.patchState({ plans, loading: false })),
            finalize(() => ctx.patchState({ loading: false }))
        );
    }
    // investment.state.ts

@Action(SavePlan)
save(ctx: StateContext<InvestmentStateModel>, { payload }: SavePlan) {
    ctx.dispatch(new SetLoading(true));

    const id = payload.id;

    // Mapping exactly to your DTO requirements
    const cleanDto = {
        name: payload.name,
        description: payload.description,
        min_amount: Number(payload.min_amount),
        max_amount: Number(payload.max_amount),
        duration_days: Number(payload.duration_days),
        interest_rate: Number(payload.interest_rate),
        status: payload.status
    };

    // Ensure the second argument is 'cleanDto'
    const request$ = id 
        ? this.service.update(id, cleanDto) 
        : this.service.create(cleanDto);

    return request$.pipe(
        tap(() => {
            ctx.dispatch(new FetchPlans());
            ctx.patchState({ selected: null });
        }),
        finalize(() => ctx.dispatch(new SetLoading(false)))
    );
}

    // @Action(SavePlan)
    // save(ctx: StateContext<InvestmentStateModel>, { payload }: SavePlan) {
    //     ctx.dispatch(new SetLoading(true));

    //     // List of fields the backend logic/database manages, not the user
    //     const {
    //         id,
    //         created_at,
    //         updated_at,
    //         ledger_account_id,
    //         ...writeableData
    //     } = payload;

    //     if (id) {
    //         // UPDATE: Send only modified configuration fields
    //         return this.service.update(id, writeableData).pipe(
    //             tap(() => {
    //                 ctx.dispatch(new FetchPlans());
    //                 ctx.patchState({ selected: null }); // Clear selection
    //             }),
    //             finalize(() => ctx.dispatch(new SetLoading(false)))
    //         );
    //     } else {
    //         // CREATE: Send clean data (status is optional here)
    //         return this.service.create(writeableData).pipe(
    //             tap(() => ctx.dispatch(new FetchPlans())),
    //             finalize(() => ctx.dispatch(new SetLoading(false)))
    //         );
    //     }
    // }
}