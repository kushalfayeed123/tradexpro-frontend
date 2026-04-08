import { User } from "../../../../common/models/user.model";
import { UpdateBalanceDto } from "../../../../core/services/transactions.service";

export class FetchUsers {
    static readonly type = '[Users] Fetch All';
    constructor(public params?: {
        email?: string;
        role?: string;
        kyc_status?: string;
        page?: number;
        limit?: number
    }) { }
}

export class SelectUser {
    static readonly type = '[Users] Select User';
    constructor(public user: User) { }
}

export class ClearSelectedUser {
    static readonly type = '[Users] Clear Selected';

}
export class UpdateBalance {
    static readonly type = '[Users] Update Balance';
    constructor(public userId: string, public amount: number, public description: string) { }

}