export class LoadInvestmentPlans { static readonly type = '[ExploreInvestment] Load Plans'; }
export class CreateInvestment { 
  static readonly type = '[ExploreInvestment] Create'; 
  constructor(public payload: { plan_id: string; amount: number; wallet_id: string }) {} 
}