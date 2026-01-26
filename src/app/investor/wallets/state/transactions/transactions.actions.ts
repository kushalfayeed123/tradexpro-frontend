export class CreateTransaction {
  static readonly type = '[InvestorTransactions] Create';
  constructor(public payload: any) { }
}


export class FetchUserTransactions {
  static readonly type = '[InvestorTransactions] Fetch';
  constructor(public payload: any) { }

}

