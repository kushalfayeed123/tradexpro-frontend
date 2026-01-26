import { DepositMethod } from "../../../../core/services/settings.service";

export class LoadDepositMethods {
  static readonly type = '[Treasury] Load Methods';
}

export class AddDepositMethod {
  static readonly type = '[Treasury] Add Method';
  constructor(public payload: DepositMethod) {}
}

export class UpdateDepositMethod {
  static readonly type = '[Treasury] Update Method';
  constructor(public payload: DepositMethod) {}
}

export class DeleteDepositMethod {
  static readonly type = '[Treasury] Delete Method';
  constructor(public id: string) {}
}