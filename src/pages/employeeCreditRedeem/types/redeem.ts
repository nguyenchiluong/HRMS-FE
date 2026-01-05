// Redeem-to-cash request contracts (naming uses "redeem" per requirement).
export type RedeemRequest = {
    amount: number; // points to convert
    method: "BANK" | "EWALLET";
    accountLabel?: string; // e.g., bank name or wallet provider
    accountNumber?: string;
    note?: string;
};

export type RedeemResponse = {
    redeemId: number;
    amount: number;
    fee?: number;
    payoutAmount?: number;
    status: RedeemStatus;
    message?: string;
    createdAt: string;
};

export type RedeemStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export type RedeemHistoryRequest = {
    page?: number;
    size?: number;
    status?: RedeemStatus;
};

export type RedeemHistoryItem = {
    id: number;
    amount: number;
    fee?: number;
    payoutAmount?: number;
    method: "BANK" | "EWALLET";
    accountLabel?: string;
    accountNumber?: string;
    status: RedeemStatus;
    requestedAt: string;
    updatedAt?: string | null;
};

export type RedeemHistoryResponse = {
    redemptions: RedeemHistoryItem[];
    totalRecords: number;
};

export type RedeemBalanceResponse = {
    bonusPoint: number;
};

export type BonusSettingsResponse = {
    baseBonusCredits: number;
    conversionRate: number; // in multiples of 1,000 (e.g., 1000 = 1:1000 ratio)
    date: number; // day of month (1-28)
    role: string;
};
