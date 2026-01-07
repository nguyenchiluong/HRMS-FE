import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, Filter as FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BalanceSummaryCard } from "../components/BalanceSummaryCard";
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
  const [showFilters, setShowFilters] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
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
    refetchBalance,
  } = useCreditsData();

  const handleRefresh = () => {
    setIsSpinning(true);
    refetchBalance();
    setTimeout(() => {
      setIsSpinning(false);
      toast.success("Credits refreshed", {
        description: "Your balance has been updated successfully.",
      });
    }, 800);
  };

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
    <div className="mt-8 space-y-6 px-6 md:px-8 min-h-screen">
      {/* Navigation Tabs */}
      <EmployeeTabsNavigation />

      {/* Balance Summary */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <BalanceSummaryCard balance={currentBalance} />
        <Card className="w-full md:max-w-2xl">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>Credit History</CardTitle>
              <CardDescription>
                Track all your bonus credit transactions including monthly bonuses, awards, transfers, and redeems.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
            <RefreshCcw className={(isFetching || isSpinning) ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            <span>Balance refreshes automatically when you reload the data.</span>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Credit History</CardTitle>
            <CardDescription>View all your bonus credit transactions</CardDescription>
          </div>
          {/* Refresh Balance Button */}
          {filteredTransactions.length > 0 && (
            <Button variant="outline" onClick={handleRefresh} disabled={isFetching || isSpinning} className="gap-2">
              <RefreshCcw className={(isFetching || isSpinning) ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              <span className="hidden sm:inline">Refresh credits</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter and View Mode Tabs */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* View Mode Tabs (Manager Only) */}
              {isManager && (
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as "all" | "team")}
                  className="md:self-start"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="all">My Balance History</TabsTrigger>
                    <TabsTrigger value="team">Team Actions</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <div className="flex md:justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`min-w-[120px] ${showFilters
                    ? "bg-blue-200 text-blue-800"
                    : "bg-blue-50 text-slate-700"
                    }`}
                >
                  {showFilters ? (
                    <X className="mr-2 h-4 w-4" />
                  ) : (
                    <FilterIcon className="mr-2 h-4 w-4" />
                  )}
                  Filter by
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="w-full">
                <Filter
                  from={from}
                  to={to}
                  onFromChange={setFrom}
                  onToChange={setTo}
                  isInvalidRange={isInvalidRange}
                  selectedTypes={selectedTypes}
                  onTypesChange={setSelectedTypes}
                  hideToggle
                  forceOpen
                />
              </div>
            )}
          </div>

          {/* Transaction History Table Card */}
          <Card>
            <CardContent
              className="overflow-y-auto min-h-[500px] pt-6"
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
