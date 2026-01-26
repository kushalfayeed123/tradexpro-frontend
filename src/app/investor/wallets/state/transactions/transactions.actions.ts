export class CreateTransaction {
  static readonly type = '[InvestorTransactions] Create';
  constructor(public payload: any) {}
}

