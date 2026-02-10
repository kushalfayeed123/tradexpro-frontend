export class LoadReferralStats {
  static readonly type = '[Referral] Load Stats';
  constructor(public userId: string) {}
}

export class CopyReferralLink {
  static readonly type = '[Referral] Copy Link';
  constructor(public code: string) {}
}