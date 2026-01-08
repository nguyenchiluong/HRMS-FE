// Redemption request contracts
export type RedeemRequest = {
    points: number; // points to convert
    note?: string; // optional note for the redemption
};

export type RedeemResponse = {
    redemptionId: number;
    convertedPoint: number;
    amountReceived: number;
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
