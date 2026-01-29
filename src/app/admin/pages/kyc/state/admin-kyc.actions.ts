export class ReviewKyc {
    static readonly type = '[AdminKyc] Review Kyc';
    constructor(
        public kycId: string,
        public decision: 'approved' | 'rejected',
        public reason?: string
    ) { }
}

export class GetPendingKycs { static readonly type = '[AdminKyc] Get Pending'; }   