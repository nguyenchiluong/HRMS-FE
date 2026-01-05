import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TeamMember } from "../types/teamMember";

interface TransferCreditsModalProps {
    mode: "transfer" | "gift" | "deduct";
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: TeamMember | null;
    onAction: (points: number, note?: string) => void;
    isLoading: boolean;
    maxPoints?: number;
}

export function TransferCreditsModal({
    mode,
    open,
    onOpenChange,
    member,
    onAction,
    isLoading,
    maxPoints,
}: TransferCreditsModalProps) {
    const [points, setPoints] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    const actionLabel = mode === "transfer" ? "Transfer" : mode === "gift" ? "Gift" : "Deduct";
    const loadingLabel = `${actionLabel}ing...`;
    const title = `${actionLabel} Credits`;
    const descriptionPrefix = mode === "deduct" ? "Deduct credits from" : "Send credits to";

    const handleTransfer = () => {
        // Reset error
        setError("");

        // Validate points
        const pointsNum = Number(points);
        if (!points || isNaN(pointsNum) || pointsNum <= 0) {
            setError("Please enter a valid number of points");
            return;
        }

        if (maxPoints !== undefined && pointsNum > maxPoints) {
            setError(`Maximum ${actionLabel.toLowerCase()} amount is ${maxPoints}`);
            return;
        }

        // Show confirmation dialog before sending
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const pointsNum = Number(points);
        onAction(pointsNum, note || undefined);

        // Reset form on success
        setPoints("");
        setNote("");
        setConfirmOpen(false);
        onOpenChange(false);
    };

    const handleClose = () => {
        setPoints("");
        setNote("");
        setError("");
        onOpenChange(false);
    };

    return (
        <>
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {descriptionPrefix} {member?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Recipient Info */}
                    <div>
                        <Label className="text-base font-semibold">To:</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="font-medium">{member?.name}</p>
                            <p className="text-sm text-muted-foreground">{member?.email}</p>
                        </div>
                    </div>

                    {/* Points Input */}
                    <div>
                        <Label htmlFor="points">Number of Points *</Label>
                        <Input
                            id="points"
                            type="number"
                            placeholder={`Enter points to ${actionLabel.toLowerCase()}`}
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            disabled={isLoading}
                            min="1"
                            max={maxPoints}
                            className="mt-1"
                        />
                        {maxPoints !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Maximum: {maxPoints.toLocaleString()} points
                            </p>
                        )}
                    </div>

                    {/* Note Input */}
                    <div>
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Add a message for the recipient"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Error Message */}
                    {error && <div className="text-sm text-red-500">{error}</div>}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleTransfer} disabled={isLoading}>
                            {isLoading ? loadingLabel : actionLabel}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm {actionLabel.toLowerCase()}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {`Are you sure you want to ${actionLabel.toLowerCase()} ${points || 0} points to ${member?.name}?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? loadingLabel : actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
