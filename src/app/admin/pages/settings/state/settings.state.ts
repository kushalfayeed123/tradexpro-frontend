import { Injectable, inject } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { SetLoading } from "../../../../auth/state/auth.actions";
import { NotificationService } from "../../../../core/services/notification.service";
import { DepositMethod, SettingsService } from "../../../../core/services/settings.service";
import { LoadDepositMethods, AddDepositMethod, UpdateDepositMethod, DeleteDepositMethod, LoadActiveDepositMethods } from "./settings.action";


export interface SettingsStateModel {
    methods: DepositMethod[];
    activeMethods: DepositMethod[];
    loading: boolean;
}
@State<SettingsStateModel>({
    name: 'treasury',
    defaults: {
        methods: [],
        activeMethods: [],
        loading: false
    }
})
@Injectable()
export class SettingsState {
    private notify = inject(NotificationService);
    private api = inject(SettingsService);

    @Selector()
    static getMethods(state: SettingsStateModel) { return state.methods || []; }

    @Selector()
    static getActiveMethods(state: SettingsStateModel) { return state.activeMethods || []; }

    @Selector()
    static activeCount(state: SettingsStateModel) {
        return (state.methods || []).filter(m => m.is_active).length;
    }

    @Action(LoadDepositMethods)
    load(ctx: StateContext<SettingsStateModel>) {
        ctx.dispatch(new SetLoading(true));
        return this.api.getAllMethods().pipe(
            tap({
                next: (res: any) => {
                    const methods = Array.isArray(res) ? res : res.data || [];
                    ctx.patchState({ methods, loading: false });
                    ctx.dispatch(new SetLoading(false));
                },
                error: () => ctx.dispatch(new SetLoading(false))
            })
        );
    }
    @Action(LoadActiveDepositMethods)
    loadActive(ctx: StateContext<SettingsStateModel>) {
        ctx.dispatch(new SetLoading(true));
        return this.api.getActiveMethods().pipe(
            tap({
                next: (res: any) => {
                    const methods = Array.isArray(res) ? res : res.data || [];
                    ctx.patchState({ activeMethods: methods, loading: false });
                    ctx.dispatch(new SetLoading(false));
                },
                error: () => ctx.dispatch(new SetLoading(false))
            })
        );
    }

    @Action(AddDepositMethod)
    add(ctx: StateContext<SettingsStateModel>, { payload }: AddDepositMethod) {
        ctx.dispatch(new SetLoading(true));
        return this.api.createMethod(payload).pipe(
            tap({
                next: (res: any) => {
                    const state = ctx.getState();
                    const newMethod = res.data || res; // Handle direct return or wrapped
                    ctx.patchState({ methods: [...state.methods, newMethod] });
                    this.notify.show('Deposit method added successfully', 'success');
                    ctx.dispatch(new SetLoading(false));
                },
                error: () => ctx.dispatch(new SetLoading(false))
            })
        );
    }

    @Action(UpdateDepositMethod)
    update(ctx: StateContext<SettingsStateModel>, { payload }: UpdateDepositMethod) {
        ctx.dispatch(new SetLoading(true));
        // payload here is the partial or full update object
        return this.api.updateMethod(payload.id!, payload).pipe(
            tap({
                next: (res: any) => {
                    const state = ctx.getState();
                    const updated = res.data || res;
                    const methods = state.methods.map(m => m.id === updated.id ? updated : m);
                    ctx.patchState({ methods });
                    this.notify.show('Gateway updated', "success");
                    ctx.dispatch(new SetLoading(false));
                },
                error: () => ctx.dispatch(new SetLoading(false))
            })
        );
    }

    @Action(DeleteDepositMethod)
    delete(ctx: StateContext<SettingsStateModel>, { id }: DeleteDepositMethod) {
        ctx.dispatch(new SetLoading(true));
        return this.api.deleteMethod(id).pipe(
            tap({
                next: () => {
                    const state = ctx.getState();
                    ctx.patchState({ methods: state.methods.filter(m => m.id !== id) });
                    this.notify.show('Method deleted', 'success');
                    ctx.dispatch(new SetLoading(false));
                },
                error: () => ctx.dispatch(new SetLoading(false))
            })
        );
    }
}