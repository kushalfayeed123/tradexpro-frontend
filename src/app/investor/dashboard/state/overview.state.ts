import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SetLoading } from '../../../auth/state/auth.actions';
import { DashboardStats, OverviewService } from '../../../core/services/investment-overview.service';


export class LoadOverviewData {
  static readonly type = '[Overview] Load Data';
}

export interface OverviewStateModel {
  stats: DashboardStats | null;
}

@State<OverviewStateModel>({
  name: 'overview',
  defaults: { stats: null }
})
@Injectable()
export class OverviewState {
  private api = inject(OverviewService);

  @Selector()
  static getStats(state: OverviewStateModel) { return state.stats; }

  @Action(LoadOverviewData)
  load(ctx: StateContext<OverviewStateModel>) {
    ctx.dispatch(new SetLoading(true));
    return this.api.getDashboardSummary().pipe(
      tap({
        next: (stats) => {
          ctx.patchState({ stats });
          ctx.dispatch(new SetLoading(false));
        },
        error: () => ctx.dispatch(new SetLoading(false))
      })
    );
  }
}