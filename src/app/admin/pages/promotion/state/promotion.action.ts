export class LoadAdminPromoData { static readonly type = '[Admin] Load Promo Data'; }
export class CreateAdminCoupon { 
  static readonly type = '[Admin] Create Coupon'; 
  constructor(public payload: any) {} 
}