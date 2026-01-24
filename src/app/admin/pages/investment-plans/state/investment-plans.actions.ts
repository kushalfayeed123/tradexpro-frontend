// Fetch all active products
export class FetchPlans {
    static readonly type = '[InvestmentPlan] Fetch Plans';
}

// Create or Update a product
export class SavePlan {
    static readonly type = '[InvestmentPlan] Save Plan';
    constructor(public payload: any) { }
}

// Toggle Plan Status (Active/Inactive)
export class TogglePlanStatus {
    static readonly type = '[InvestmentPlan] Toggle Status';
    constructor(public payload: any) { }
}

// Select a plan for the editor
export class SelectPlan {
    static readonly type = '[InvestmentPlan] Select Plan';
    constructor(public payload: any) { }
}