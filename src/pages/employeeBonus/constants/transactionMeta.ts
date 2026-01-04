import { TransactionType } from "../types/transaction";

export type TransactionMeta = {
  label: string;
  isCredit: boolean;
  badgeVariant: "default" | "secondary" | "destructive";
};

export const TRANSACTION_META: Record<TransactionType, TransactionMeta> = {
  REDEEM: { label: "Redeemed", isCredit: false, badgeVariant: "destructive" },
  TRANSFER_SENT: {
    label: "Transfer Sent",
    isCredit: false,
    badgeVariant: "destructive",
  },
  TRANSFER_RECEIVED: {
    label: "Transfer Received",
    isCredit: true,
    badgeVariant: "default",
  },
  DEDUCT: {
    label: "Deduction",
    isCredit: false,
    badgeVariant: "secondary",
  },
  AWARD: { label: "Award", isCredit: true, badgeVariant: "default" },
  MONTHLY: { label: "Monthly Bonus", isCredit: true, badgeVariant: "default" },
};
