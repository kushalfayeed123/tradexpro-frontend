export class FetchMyInvestments {
  static readonly type = '[Investor] Fetch My Investments';
}

export class SelectInvestment {
  static readonly type = '[Investor] Select Investment';
  constructor(public payload: string) {} // ID of the investment
}