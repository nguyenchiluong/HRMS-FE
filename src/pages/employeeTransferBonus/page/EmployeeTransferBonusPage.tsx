import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Gift, MinusCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useBalance } from "../hooks/useBalance";
import { TeamMembersTable } from "../components/TeamMembersTable";
import { TransferCreditsModal } from "../components/TransferCreditsModal";
import { PaginationControls } from "../components/PaginationControls";
import { TeamMember } from "../types/teamMember";
import { BalanceSummaryCard } from "../../employeeBonus/components/BalanceSummaryCard";

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
        transferCredits,
        isTransferring,
        giftCredits,
        isGifting,
        deductCredits,
        isDeducting,
    } = useTeamMembers();

    const { balance, isLoading: isBalanceLoading } = useBalance();

    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [actionMode, setActionMode] = useState<"transfer" | "gift" | "deduct">("transfer");
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const isActionLoading = isTransferring || isGifting || isDeducting;

    const handleTransferClick = (member: TeamMember) => {
        setSelectedMember(member);
        setActionMode("transfer");
        setTransferModalOpen(true);
    };

    const handleAction = (points: number, note?: string) => {
        if (selectedMember) {
            const payload = {
                recipientId: selectedMember.id,
                points,
                note,
            };

            if (actionMode === "gift") {
                giftCredits(payload);
            } else if (actionMode === "deduct") {
                deductCredits(payload);
            } else {
                transferCredits(payload);
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
        <div className="space-y-6">
            {/* Balance Summary */}
            <BalanceSummaryCard balance={balance} />

            {/* Team Members Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Transfer Credits</h2>
                    <p className="text-muted-foreground mt-1">
                        Send bonus credits to your team members
                    </p>
                </div>

                {/* Team Members Table */}
                <TeamMembersTable
                    teamMembers={teamMembers}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    renderAction={(member) => (
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    setSelectedMember(member);
                                    setActionMode("gift");
                                    setTransferModalOpen(true);
                                }}
                                disabled={isActionLoading || isLoading}
                                className="gap-2"
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
                                className="gap-2"
                            >
                                <MinusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Deduct</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleTransferClick(member)}
                                disabled={isActionLoading || isLoading}
                                className="gap-2"
                            >
                                <Send className="h-4 w-4" />
                                <span className="hidden sm:inline">Transfer</span>
                            </Button>
                        </div>
                    )}
                />

                {/* Pagination */}
                <div className="mt-4">
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
                    <div className="text-sm text-muted-foreground mt-4">
                        Showing {(page - 1) * pageSize + 1} to{" "}
                        {Math.min(page * pageSize, totalRecords)} of {totalRecords.toLocaleString()} team members
                    </div>
                )}
            </div>

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
