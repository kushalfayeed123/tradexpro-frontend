import { User } from "../../common/models/user.model";

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { token: string; user: User }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetLoading {
  static readonly type = '[Auth] Set Loading';
  constructor(public isLoading: boolean) {}
}

export class UpdateUser {
  static readonly type = '[Auth] Update User';
  constructor(public user: User) {}
}
export class VerifyOtp {
  static readonly type = '[Auth] Verify Otp';
  constructor(public code: string, public userId: string) {}
}
export class InitializeAuth {
  static readonly type = '[Auth] Initialize';
}