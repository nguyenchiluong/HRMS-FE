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
import { BankAccountRecord } from "../types/bankAccount";

interface RedeemConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    payoutAmount?: number;
    payoutVND?: number;
    bankAccount?: BankAccountRecord;
    note?: string;
    isLoading: boolean;
    onConfirm: () => void;
}

// Confirmation dialog for submitting a withdrawal transaction.
export function RedeemCreditsModal({
    open,
    onOpenChange,
    amount,
    payoutVND,
    bankAccount,
    note,
    isLoading,
    onConfirm,
}: RedeemConfirmModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[460px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm withdrawal</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will instantly convert your bonus points to cash. Please confirm the details below.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <Card className="border bg-muted/50 p-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</p>
                                <p className="mt-1 text-3xl font-bold">{amount.toLocaleString()} pts</p>
                            </div>
                            {payoutVND !== undefined && (
                                <div className="border-t pt-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">You will receive</p>
                                    <p className="mt-1 text-2xl font-bold text-green-600">{payoutVND.toLocaleString()} VND</p>
                                </div>
                            )}
                            {bankAccount && (
                                <div className="border-t pt-3 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">Destination</p>
                                    <p>{bankAccount.bankName}</p>
                                    <p>{bankAccount.accountNumber}</p>
                                    <p>{bankAccount.accountName}</p>
                                </div>
                            )}
                            {note && (
                                <div className="border-t pt-3 text-sm">
                                    <p className="font-medium text-foreground">Note</p>
                                    <p className="text-muted-foreground">{note}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <AlertDialogDescription className="text-center text-sm">
                    This action cannot be undone.
                </AlertDialogDescription>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm withdrawal"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
