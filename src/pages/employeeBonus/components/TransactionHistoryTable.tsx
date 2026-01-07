import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BalanceHistoryItem } from "../types/transaction";
import { TRANSACTION_META } from "../constants/transactionMeta";
import { formatDate, formatTime, truncateText } from "../utils/dateFormatters";
import { useAuthStore } from "@/feature/shared/auth/store/useAuthStore";

interface TransactionHistoryTableProps {
  transactions: BalanceHistoryItem[];
  isLoading: boolean;
  isFetching: boolean;
  totalRecords: number;
  onTransactionSelect: (transaction: BalanceHistoryItem) => void;
}

export function TransactionHistoryTable({
  transactions,
  isLoading,
  isFetching,
  totalRecords,
  onTransactionSelect,
}: TransactionHistoryTableProps) {
  const { user } = useAuthStore();
  const isManager = !!user?.roles?.includes("MANAGER");
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No transactions in the selected date range
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Transaction History
          {isFetching && (
            <span className="ml-2 text-xs text-muted-foreground">Updating…</span>
          )}
          <span className="ml-2 text-sm text-muted-foreground">
            ({totalRecords})
          </span>
        </h3>
      </div>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Transaction</TableHead>
            <TableHead className="w-[25%]">Note</TableHead>
            <TableHead className="w-[20%]">Date</TableHead>
            <TableHead className="w-[20%] text-right">Points</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((item) => {
            const meta = TRANSACTION_META[item.type];
            const directionText =
              item.type === "TRANSFER_RECEIVED" && item.counterpartyName
                ? `Received from ${item.counterpartyName}`
                : item.type === "TRANSFER_SENT" && item.counterpartyName
                  ? `Sent to ${item.counterpartyName}`
                  : item.type === "AWARD"
                    ? isManager
                      ? `Award to${item.counterpartyName ? ` ${item.counterpartyName}` : ""}`
                      : `Awarded${item.counterpartyName ? ` by ${item.counterpartyName}` : ""}`
                    : item.type === "DEDUCT"
                      ? isManager
                        ? `Deduct from${item.counterpartyName ? ` ${item.counterpartyName}` : ""}`
                        : `Deducted${item.counterpartyName ? ` by ${item.counterpartyName}` : ""}`
                      : item.type === "REDEEM" && item.counterpartyName
                        ? `Redeemed at ${item.counterpartyName}`
                        : item.type === "MONTHLY"
                          ? "Monthly bonus"
                          : null;

            return (
              <TableRow
                key={item.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors"
                onClick={() => onTransactionSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onTransactionSelect(item);
                  }
                }}
              >
                {/* Transaction */}
                <TableCell className="truncate">
                  <div className="font-medium truncate">
                    {meta.label}
                  </div>
                  {directionText && (
                    <div className="text-sm text-muted-foreground truncate">
                      {directionText}
                    </div>
                  )}
                </TableCell>

                {/* Note */}
                <TableCell
                  className="truncate text-sm text-muted-foreground"
                  title={item.note ?? undefined}
                >
                  {item.note ? truncateText(item.note) : "—"}
                </TableCell>

                {/* Date */}
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(item.createdAt)}
                  <div className="text-xs">
                    {formatTime(item.createdAt)}
                  </div>
                </TableCell>

                {/* Points */}
                <TableCell
                  className={`whitespace-nowrap text-right font-semibold ${meta.isCredit ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {meta.isCredit ? "+" : "-"}
                  {Math.abs(item.points).toLocaleString()} pts
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
