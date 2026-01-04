import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTeamMembers } from "../hooks/useTeamMembers";
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
    } = useTeamMembers();

    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [currentBalance] = useState<number>(1000); // You can replace this with actual balance from context/store

    const handleTransferClick = (member: TeamMember) => {
        setSelectedMember(member);
        setTransferModalOpen(true);
    };

    const handleTransfer = (points: number, note?: string) => {
        if (selectedMember) {
            transferCredits({
                recipientId: selectedMember.id,
                points,
                note,
            });
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
            <BalanceSummaryCard balance={currentBalance} />

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
                        <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleTransferClick(member)}
                            disabled={isTransferring || isLoading}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            <span className="hidden sm:inline">Transfer</span>
                        </Button>
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
                open={transferModalOpen}
                onOpenChange={setTransferModalOpen}
                member={selectedMember}
                onTransfer={handleTransfer}
                isLoading={isTransferring}
                maxPoints={currentBalance}
            />
        </div>
    );
}
