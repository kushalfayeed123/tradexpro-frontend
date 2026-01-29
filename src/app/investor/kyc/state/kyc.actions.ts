// Actions
export class GetUserKyc { static readonly type = '[KYC] Get User KYC'; }
export class InitiateKyc { static readonly type = '[KYC] Initiate'; constructor(public level: number) { } }
export class SubmitKycDocument {
    static readonly type = '[KYC] Submit Document';
    constructor(public file: File, public docType: string) { }
}

export class ViewKycDocument {
    static readonly type = '[KYC] View Document';
    constructor(public path: string) { }
}