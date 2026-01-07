import { Card, CardContent } from "@/components/ui/card";
import { BalanceSummaryCard } from "../components/BalanceSummaryCard";
import { Filter } from "../components/Filter";
import { TransactionHistoryTable } from "../components/TransactionHistoryTable";
import { PaginationControls } from "../components/PaginationControls";
import { TransactionDetailsSheet } from "../components/TransactionDetailsSheet";
import { useCreditsData } from "../hooks/useCreditsData";

export default function EmployeeBonusPage() {
  const {
    from,
    to,
    page,
    pageSize,
    jumpPage,
    selected,
    selectedTypes,
    isLoading,
    isFetching,
    error,
    isInvalidRange,
    totalPages,
    transactions,
    currentBalance,
    totalRecords,
    setFrom,
    setTo,
    setPage,
    setPageSize,
    setJumpPage,
    setSelected,
    setSelectedTypes,
    handleJump,
  } = useCreditsData();

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load transactions
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <BalanceSummaryCard balance={currentBalance} />

      {/* Date Range Filter */}
      <Filter
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        isInvalidRange={isInvalidRange}
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
      />

      {/* Transaction History */}
      <Card>
        <CardContent className="pt-6">
          <TransactionHistoryTable
            transactions={transactions}
            isLoading={isLoading}
            isFetching={isFetching}
            totalRecords={totalRecords}
            onTransactionSelect={setSelected}
          />

          {/* Pagination Controls */}
          {transactions.length > 0 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={pageSize}
              jumpPageValue={jumpPage}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onJumpPageChange={setJumpPage}
              onJumpPageSubmit={handleJump}
            />
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Sheet */}
      <TransactionDetailsSheet
        transaction={selected}
        isOpen={!!selected}
        onOpenChange={() => setSelected(null)}
      />
    </div>
  );
}
