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

interface RedeemConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    accountLabel?: string;
    accountNumber?: string;
    note?: string;
    payoutAmount?: number;
    isLoading: boolean;
    onConfirm: () => void;
}

// Confirmation dialog for submitting a redeem-to-cash request.
export function RedeemCreditsModal({
    open,
    onOpenChange,
    amount,
    accountLabel,
    accountNumber,
    note,
    payoutAmount,
    isLoading,
    onConfirm,
}: RedeemConfirmModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[460px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm redeem request</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are converting bonus points to cash. Please confirm the details below.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <Card className="border bg-muted/50 p-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</p>
                                <p className="mt-1 text-3xl font-bold">{amount.toLocaleString()} pts</p>
                            </div>
                            {(accountLabel || accountNumber) && (
                                <div className="border-t pt-3 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">Destination</p>
                                    {accountLabel && <p>{accountLabel}</p>}
                                    {accountNumber && <p>{accountNumber}</p>}
                                </div>
                            )}
                            {note && (
                                <div className="border-t pt-3 text-sm text-muted-foreground italic">"{note}"</div>
                            )}
                        </div>
                    </Card>
                </div>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit request"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
