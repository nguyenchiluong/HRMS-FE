import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Gift, MinusCircle, Send, Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useBalance } from "../hooks/useBalance";
import { TeamMembersTable } from "../components/TeamMembersTable";
import { SearchBox } from "../components/SearchBox";
import { TransferCreditsModal } from "../components/TransferCreditsModal";
import { PaginationControls } from "../components/PaginationControls";
import { TeamMember } from "../types/teamMember";
import { BalanceSummaryCard } from "../../employeeBonus/components/BalanceSummaryCard";
import { EmployeeTabsNavigation } from "../../sharedBonusComponents/EmployeeTabsNavigation";

export default function EmployeeTransferBonusPage() {
    const {
        teamMembers,
        totalRecords,
        totalPages,
        page,
        pageSize,
        isLoading,
        isFetching,
        error,
        setPage,
        setPageSize,
        search,
        setSearch,
        transferCredits,
        isTransferring,
        giftCredits,
        isGifting,
        deductCredits,
        isDeducting,
        userRole,
    } = useTeamMembers();

    const { balance, isFetching: isBalanceFetching, refetch: refetchBalance } = useBalance();

    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [actionMode, setActionMode] = useState<"transfer" | "gift" | "deduct">("transfer");
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const isActionLoading = isTransferring || isGifting || isDeducting;

    const handleTransferClick = (member: TeamMember) => {
        setSelectedMember(member);
        setActionMode("transfer");
        setTransferModalOpen(true);
    };

    // Refresh balance whenever the modal opens to keep maxPoints accurate
    useEffect(() => {
        if (transferModalOpen) {
            refetchBalance();
        }
    }, [transferModalOpen, refetchBalance]);

    const handleAction = (points: number, note?: string) => {
        if (selectedMember) {
            if (actionMode === "gift") {
                giftCredits({
                    receiverId: selectedMember.id,
                    points,
                    note,
                    type: "AWARD",
                });
            } else if (actionMode === "deduct") {
                deductCredits({
                    receiverId: selectedMember.id,
                    points,
                    note,
                    type: "DEDUCT",
                });
            } else {
                transferCredits({
                    receiverId: selectedMember.id,
                    points,
                    note,
                    type: "TRANSFER",
                });
            }
        }
    };

    // Error state
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load team members. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="mt-8 px-6 md:px-8 space-y-6 min-h-screen">
            {/* Navigation Tabs */}
            <EmployeeTabsNavigation />

            {/* Balance Summary */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <BalanceSummaryCard balance={balance} />
                <Card className="w-full md:max-w-2xl">
                    <CardHeader>
                        <div className="space-y-1">
                            <CardTitle>Transfer Credits</CardTitle>
                            <CardDescription>
                                Send bonus credits to your team members or receive transfers from colleagues.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
                        <RefreshCcw className={isBalanceFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                        <span>Balance refreshes automatically when you open the confirmation dialog.</span>
                    </CardContent>
                </Card>
            </div>

            {/* Team Members Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-2xl">Transfer Credits</CardTitle>
                            <CardDescription className="mt-1">
                                Send bonus credits to your team members
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="w-full sm:w-64">
                                <SearchBox
                                    value={search}
                                    onChange={setSearch}
                                    disabled={isLoading}
                                    isFetching={isFetching}
                                />
                            </div>
                            <Button variant="outline" onClick={() => refetchBalance()} disabled={isBalanceFetching} className="gap-2 shrink-0">
                                <RefreshCcw className={isBalanceFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                                <span className="hidden md:inline">Refresh credits</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Team Members Table */}
                    <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
                        <TeamMembersTable
                            teamMembers={teamMembers}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            renderAction={(member) => (
                                <div className="flex justify-end gap-2">
                                    {userRole === "MANAGER" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setActionMode("gift");
                                                    setTransferModalOpen(true);
                                                }}
                                                disabled={isActionLoading || isLoading}
                                                className="gap-1"
                                                title="Gift credits to this member"
                                            >
                                                <Gift className="h-4 w-4" />
                                                <span className="hidden sm:inline">Gift</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setActionMode("deduct");
                                                    setTransferModalOpen(true);
                                                }}
                                                disabled={isActionLoading || isLoading}
                                                className="gap-1"
                                                title="Deduct credits from this member"
                                            >
                                                <MinusCircle className="h-4 w-4" />
                                                <span className="hidden sm:inline">Deduct</span>
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleTransferClick(member)}
                                        disabled={isActionLoading || isLoading}
                                        className="gap-1"
                                        title="Transfer credits to this member"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span className="hidden sm:inline">Transfer</span>
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    {/* Loading indicator for refetch */}
                    {isFetching && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="border-t pt-4">
                        <PaginationControls
                            page={page}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Total Records Info */}
                    {totalRecords > 0 && (
                        <div className="text-xs text-muted-foreground">
                            Showing {(page - 1) * pageSize + 1} to{" "}
                            {Math.min(page * pageSize, totalRecords)} of {totalRecords.toLocaleString()} team members
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transfer Credits Modal */}
            <TransferCreditsModal
                mode={actionMode}
                open={transferModalOpen}
                onOpenChange={setTransferModalOpen}
                member={selectedMember}
                onAction={handleAction}
                isLoading={isActionLoading}
                maxPoints={actionMode === "transfer" ? balance : undefined}
            />
        </div>
    );
}
