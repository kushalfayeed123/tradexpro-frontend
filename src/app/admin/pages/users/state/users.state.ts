import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { User } from '../../../../common/models/user.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { UsersApiService } from '../../../../core/services/users.service';
import { FetchUsers, SelectUser, ClearSelectedUser } from './users.action';


export interface UsersStateModel {
    items: User[];
    meta: { total: number; page: number; totalPages: number };
    selectedUser: User | null;
    loading: boolean;
}

@State<UsersStateModel>({
    name: 'users',
    defaults: { items: [], meta: { total: 0, page: 1, totalPages: 1 }, selectedUser: null, loading: false }
})
@Injectable()
export class UsersState {
    private api = inject(UsersApiService);
    private notify = inject(NotificationService);

    @Selector() static list(state: UsersStateModel) { return state.items; }
    @Selector() static loading(state: UsersStateModel) { return state.loading; }
    @Selector() static selected(state: UsersStateModel) { return state.selectedUser; }
    @Selector() static meta(state: UsersStateModel) { return state.meta; }


    @Action(FetchUsers)
    async fetchUsers(ctx: StateContext<UsersStateModel>, action: FetchUsers) {
        ctx.patchState({ loading: true });

        try {
            // Access the params from the action instance
            const response = await this.api.fetchAll(action.params);

            ctx.patchState({
                items: response.data,
                meta: response.meta,
                loading: false
            });
        } catch (error) {
            ctx.patchState({ loading: false });
            this.notify.show('Error loading users', 'error');
        }
    }

    @Action(SelectUser)
    setSelected(ctx: StateContext<UsersStateModel>, { user }: SelectUser) {
        ctx.patchState({ selectedUser: user });
    }
}