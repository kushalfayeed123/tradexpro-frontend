import { User } from "../../../../common/models/user.model";

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