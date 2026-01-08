import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BalanceSummaryCard } from "../../employeeBonus/components/BalanceSummaryCard";
import { EmployeeTabsNavigation } from "../../sharedBonusComponents/EmployeeTabsNavigation";
import { RedeemCreditsModal } from "../components/RedeemCreditsModal";
import { useRedeemRequest } from "../hooks/useRedeemables";
import { useRedeemBalance } from "../hooks/useRedeemBalance";
import { useBonusSettings } from "../hooks/useBonusSettings";
import { useBankAccount } from "../hooks/useBankAccount";
import { useEffect } from "react";

export default function EmployeeCreditRedeemPage() {
    const { balance, isFetching: isBalanceFetching, refetch: refetchBalance } = useRedeemBalance();
    const { submitRedeem, isSubmitting } = useRedeemRequest();
    const { creditToVndRate, isLoading: isSettingsLoading } = useBonusSettings();
    const { bankAccount } = useBankAccount();

    const [amount, setAmount] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const handleRefresh = () => {
        setIsSpinning(true);
        refetchBalance();
        setTimeout(() => {
            setIsSpinning(false);
            setLastUpdated(new Date());
            toast.success("Credits refreshed", {
                description: "Your balance has been updated successfully.",
            });
        }, 800);
    };

    // Refresh balance on page load and when confirmation dialog opens
    useEffect(() => {
        refetchBalance();
    }, [refetchBalance]);

    useEffect(() => {
        if (confirmOpen) {
            refetchBalance();
        }
    }, [confirmOpen, refetchBalance]);

    const payoutAmount = useMemo(() => {
        return Math.max(0, Number(amount) || 0);
    }, [amount]);

    const payoutVND = useMemo(() => {
        return payoutAmount * creditToVndRate;
    }, [payoutAmount, creditToVndRate]);

    const handleSubmit = () => {
        setFormError("");
        const amt = Number(amount);
        if (!amt || Number.isNaN(amt) || amt <= 0) {
            setFormError("Enter a valid amount of points to withdraw.");
            return;
        }
        if (amt > balance) {
            setFormError("Insufficient balance for this withdrawal.");
            return;
        }
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const amt = Number(amount);
        submitRedeem({
            points: amt,
        });
        setConfirmOpen(false);
    };

    return (
        <div className="mt-8 px-6 md:px-8 space-y-6 min-h-screen">
            {/* Navigation Tabs */}
            <EmployeeTabsNavigation />

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <BalanceSummaryCard balance={balance} lastUpdated={lastUpdated} />
                <Card className="w-full md:max-w-2xl">
                    <CardHeader>
                        <div className="space-y-1">
                            <CardTitle>Withdraw Credits</CardTitle>
                            <CardDescription>
                                Instantly convert your bonus credits to cash and send to your account.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
                        <RefreshCcw className={(isBalanceFetching || isSpinning) ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                        <span>Balance refreshes automatically when you open the confirmation dialog.</span>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Withdraw credits</CardTitle>
                    <CardDescription>Specify amount to convert to VND and receive instant payout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (points)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min={1}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">Available: {balance.toLocaleString()} pts</p>
                        </div>
                        {bankAccount && (
                            <div className="space-y-2">
                                <Label>Destination account</Label>
                                <div className="rounded-md border bg-slate-100 p-3 text-sm">
                                    <p className="font-medium">{bankAccount.bankName}</p>
                                    <p className="text-muted-foreground">{bankAccount.accountNumber}</p>
                                    <p className="text-muted-foreground">{bankAccount.accountName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {formError && <div className="text-sm text-red-600">{formError}</div>}

                    <div className="flex flex-col gap-2 rounded-md border bg-muted/60 p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Requested</span>
                            <span className="font-semibold">{Number(amount || 0).toLocaleString()} pts</span>
                        </div>
                        <div className="border-t pt-2">
                            <div className="flex items-center justify-between font-semibold">
                                <span>Payout (points)</span>
                                <span>{payoutAmount.toLocaleString()} pts</span>
                            </div>
                        </div>
                        <div className="border-t pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Rate</span>
                                <span>{isSettingsLoading ? "Loading..." : `1 credit = ${creditToVndRate.toLocaleString()} VND`}</span>
                            </div>
                            <div className="flex items-center justify-between font-semibold text-green-600">
                                <span>VND equivalent</span>
                                <span>{payoutVND.toLocaleString()} VND</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleRefresh} disabled={isBalanceFetching || isSpinning} className="gap-2">
                            <RefreshCcw className={(isBalanceFetching || isSpinning) ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                            Refresh credits
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Withdraw now"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <RedeemCreditsModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                amount={Number(amount) || 0}
                payoutAmount={payoutAmount}
                payoutVND={payoutVND}
                bankAccount={bankAccount}
                isLoading={isSubmitting}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
