// state/transactions.action.ts

export class FetchTransactions {
    static readonly type = '[Transactions] Fetch';
    constructor(public payload?: {
        page?: number;
        limit?: number;
        type?: string;
        search?: string;
    }) { }
}

export class SelectTransaction {
    static readonly type = '[Transactions] Select';
    constructor(public payload: any) { }
}

export class ClearSelectedTransaction {
    static readonly type = '[Transactions] Clear Selected';
}

export class ApproveTransaction {
    static readonly type = '[Transactions] Approve';
    constructor(public id: string) { }
}
export class ReverseTransaction {
    static readonly type = '[Transactions] Reverse';
    constructor(public id: string) { }
}
export class RejectTransaction {
    static readonly type = '[Transactions] Reject';
    constructor(public id: string) { }
}