import { InvestmentParams } from "../../../../core/services/investment.service";

export class FetchAllInvestments {
  static readonly type = '[Investments] Fetch All';
  constructor(public params?: InvestmentParams) {}
}

export class MatureInvestment {
  static readonly type = '[Investments] Mature';
  constructor(public id: string) {}
}

export class UpdateAccruedReturn {
  static readonly type = '[Investments] Update Accrued Return';
  constructor(public payload: any) {}
}