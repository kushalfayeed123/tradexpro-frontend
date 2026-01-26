/**
 * Action to trigger the loading of the dashboard summary.
 * This will be dispatched from the Component's ngOnInit.
 */
export class LoadOverviewData {
  static readonly type = '[Overview] Load Data';
}

/**
 * Optional: Action to clear overview state (useful on Logout)
 */
export class ClearOverviewData {
  static readonly type = '[Overview] Clear Data';
}


