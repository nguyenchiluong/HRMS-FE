export type TransactionType =
  | "REDEEM"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "DEDUCT"
  | "AWARD"
  | "MONTHLY";

export type BalanceHistoryItem = {
  id: number;
  type: TransactionType;
  points: number;
  amount: number | null;
  note: string | null;
  counterpartyId: number | null;
  counterpartyName: string | null;
  currency: string | null;
  createdAt: string;
};

export type ViewCreditsRequest = {
  dateRange: {
    from: string;
    to: string;
  };
  types: TransactionType[];
  sort: {
    field: "createdAt";
    direction: "ASC" | "DESC";
  };
  page?: number;
  size?: number;
};

export type ViewCreditsResponse = {
  empId: number;
  currentBalance: number;
  totalRedeemed: number | null;
  totalSent: number | null;
  totalReceived: number | null;
  totalRecords: number;
  history: BalanceHistoryItem[];
};
