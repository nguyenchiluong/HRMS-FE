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
import { Card } from "@/components/ui/card";
import { AlertCircle, Gift, MinusCircle, Send } from "lucide-react";
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
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm {actionLabel}</AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                        {/* Action Type Badge with Icon */}
                        <div className="flex items-center gap-2">
                            {mode === "transfer" && (
                                <>
                                    <Send className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600">Transfer</span>
                                </>
                            )}
                            {mode === "gift" && (
                                <>
                                    <Gift className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium text-green-600">Gift</span>
                                </>
                            )}
                            {mode === "deduct" && (
                                <>
                                    <MinusCircle className="h-5 w-5 text-red-500" />
                                    <span className="text-sm font-medium text-red-600">Deduct</span>
                                </>
                            )}
                        </div>

                        {/* Summary Card */}
                        <Card className="border bg-muted/50 p-4">
                            <div className="space-y-3">
                                {/* Recipient */}
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {mode === "deduct" ? "From" : "To"}
                                    </p>
                                    <p className="mt-1 text-lg font-semibold">{member?.name}</p>
                                    <p className="text-sm text-muted-foreground">{member?.email}</p>
                                </div>

                                {/* Amount */}
                                <div className="border-t pt-3">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Amount
                                    </p>
                                    <p className="mt-1 text-3xl font-bold">{points}</p>
                                    <p className="text-sm text-muted-foreground">points</p>
                                </div>

                                {/* Note if provided */}
                                {note && (
                                    <div className="border-t pt-3">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Note
                                        </p>
                                        <p className="mt-1 text-sm italic text-muted-foreground">"{note}"</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Warning for Deduct */}
                        {mode === "deduct" && (
                            <div className="flex gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                <p className="text-sm text-red-700">
                                    This will deduct points from the employee's balance.
                                </p>
                            </div>
                        )}

                        {/* Confirmation message */}
                        <AlertDialogDescription className="text-center text-sm">
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </div>

                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={
                                mode === "deduct"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : mode === "gift"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : ""
                            }
                        >
                            {isLoading ? loadingLabel : `Confirm ${actionLabel}`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
