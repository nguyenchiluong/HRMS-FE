import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSummaryCard } from "../components/BalanceSummaryCard";
import { PageInfoCard } from "../../sharedBonusComponents/PageInfoCard";
import { EmployeeTabsNavigation } from "../../sharedBonusComponents/EmployeeTabsNavigation";
import { Filter } from "../components/Filter";
import { TransactionHistoryTable } from "../components/TransactionHistoryTable";
import { PaginationControls } from "../components/PaginationControls";
import { TransactionDetailsSheet } from "../components/TransactionDetailsSheet";
import { useCreditsData } from "../hooks/useCreditsData";
import { useAuthStore } from "@/feature/shared/auth/store/useAuthStore";

export default function EmployeeBonusPage() {
  const { user } = useAuthStore();
  const isManager = !!user?.roles?.includes("MANAGER");
  const [viewMode, setViewMode] = useState<"all" | "team">("all");
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

  // Filter transactions for team actions view (manager only)
  const filteredTransactions = viewMode === "team" && isManager
    ? transactions.filter((t) => t.type === "AWARD" || t.type === "DEDUCT")
    : transactions;

  // Only show full-page skeleton on initial load (no cached data yet)
  const isInitialLoading = isLoading && transactions.length === 0 && currentBalance === undefined;

  // Loading state - only for initial load
  if (isInitialLoading) {
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
    <div className="mt-8 space-y-6 px-6 md:px-8">
      {/* Navigation Tabs */}
      <EmployeeTabsNavigation />

      {/* Balance Summary */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <BalanceSummaryCard balance={currentBalance} />
        <PageInfoCard
          title="Your Balance History"
          description="Track all your bonus credit transactions including monthly bonuses, awards, transfers, and redeems."
        />
      </div>

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

      {/* View Mode Tabs (Manager Only) */}
      {isManager && (
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "all" | "team")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">My Balance History</TabsTrigger>
            <TabsTrigger value="team">Team Actions</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Transaction History */}
      <Card>
        <CardContent
          className="pt-6 overflow-y-auto min-h-[500px]"
          style={{ scrollbarGutter: "stable" }}
        >
          <TransactionHistoryTable
            transactions={filteredTransactions}
            isLoading={isLoading}
            isFetching={isFetching}
            totalRecords={viewMode === "team" && isManager ? filteredTransactions.length : totalRecords}
            onTransactionSelect={setSelected}
          />

          {/* Pagination Controls */}
          {filteredTransactions.length > 0 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalRecords={viewMode === "team" && isManager ? filteredTransactions.length : totalRecords}
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
