import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BalanceHistoryItem } from "../types/transaction";
import { TRANSACTION_META } from "../constants/transactionMeta";
import { formatDateTime } from "../utils/dateFormatters";

interface TransactionDetailsSheetProps {
  transaction: BalanceHistoryItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsSheet({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null;

  const meta = TRANSACTION_META[transaction.type];
  const formattedPoints = transaction.points.toLocaleString();
  const formattedAmount =
    transaction.amount != null
      ? transaction.amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      : null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <strong>Type:</strong> {meta.label}
          </div>

          <div>
            <strong>Date:</strong> {formatDateTime(transaction.createdAt)}
          </div>

          <div>
            <strong>Points:</strong> {formattedPoints}
          </div>

          {transaction.amount != null && transaction.currency && (
            <div>
              <strong>Amount:</strong> {formattedAmount} {transaction.currency}
            </div>
          )}

          {transaction.counterpartyName && (
            <div>
              <strong>{meta.isCredit ? "From" : "To"}:</strong>{" "}
              {transaction.counterpartyName}
            </div>
          )}

          {transaction.note && (
            <div>
              <strong>Note:</strong>
              <div className="mt-1 text-muted-foreground break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
                {transaction.note}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
