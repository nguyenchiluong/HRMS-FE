import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BalanceSummaryCard } from "../../employeeBonus/components/BalanceSummaryCard";
import { RedeemCreditsModal } from "../components/RedeemCreditsModal";
import { useRedeemRequest } from "../hooks/useRedeemables";
import { useRedeemBalance } from "../hooks/useRedeemBalance";
import { useBonusSettings } from "../hooks/useBonusSettings";
import { useBankAccount } from "../hooks/useBankAccount";

export default function EmployeeCreditRedeemPage() {
    const { balance, isFetching: isBalanceFetching, refetch: refetchBalance } = useRedeemBalance();
    const { submitRedeem, isSubmitting } = useRedeemRequest();
    const { creditToUsdRate, isLoading: isSettingsLoading } = useBonusSettings();
    const { bankAccount } = useBankAccount();

    const [amount, setAmount] = useState<string>("");
    const [accountLabel, setAccountLabel] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Populate form with bank account data when it loads
    useEffect(() => {
        if (bankAccount) {
            setAccountLabel(bankAccount.bankName);
            setAccountNumber(bankAccount.accountNumber);
        }
    }, [bankAccount]);

    const payoutAmount = useMemo(() => {
        return Math.max(0, Number(amount) || 0);
    }, [amount]);

    const payoutUSD = useMemo(() => {
        return payoutAmount * creditToUsdRate;
    }, [payoutAmount, creditToUsdRate]);

    const handleSubmit = () => {
        setFormError("");
        const amt = Number(amount);
        if (!amt || Number.isNaN(amt) || amt <= 0) {
            setFormError("Enter a valid amount of points to redeem.");
            return;
        }
        if (amt > balance) {
            setFormError("Insufficient balance for this redeem.");
            return;
        }
        if (!accountNumber.trim()) {
            setFormError("Destination account is required.");
            return;
        }
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const amt = Number(amount);
        submitRedeem({
            amount: amt,
            accountLabel: accountLabel || undefined,
            accountNumber: accountNumber || undefined,
            note: note || undefined,
        });
        setConfirmOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <BalanceSummaryCard balance={balance} />
                <Card className="w-full md:max-w-2xl">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle>Redeem credits</CardTitle>
                            <CardDescription>
                                Convert your bonus credits to cash and send to your saved account.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
                        <RefreshCcw className={`h-4 w-4 ${isBalanceFetching ? "animate-spin" : ""}`} />
                        <span>Balance refreshes automatically when you open the confirmation dialog.</span>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create redeem request</CardTitle>
                    <CardDescription>Specify amount and destination for payout.</CardDescription>
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
                        <div className="space-y-2">
                            <Label htmlFor="accountLabel">Bank / wallet name</Label>
                            <Input
                                id="accountLabel"
                                value={accountLabel}
                                onChange={(e) => setAccountLabel(e.target.value)}
                                disabled={isSubmitting || !!bankAccount}
                                placeholder="e.g. Vietcombank, Momo"
                                className="disabled:bg-slate-200 disabled:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account / phone number</Label>
                            <Input
                                id="accountNumber"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                disabled={isSubmitting || !!bankAccount}
                                placeholder="Enter destination account"
                                className="disabled:bg-slate-200 disabled:text-slate-600"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="note">Note (optional)</Label>
                            <Textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={isSubmitting}
                                className="resize-none"
                                rows={3}
                                placeholder="Add context for finance team"
                            />
                        </div>
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
                                <span>{isSettingsLoading ? "Loading..." : `1 credit = $${creditToUsdRate.toFixed(4)}`}</span>
                            </div>
                            <div className="flex items-center justify-between font-semibold text-green-600">
                                <span>USD equivalent</span>
                                <span>${payoutUSD.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => refetchBalance()} disabled={isBalanceFetching} className="gap-2">
                            <RefreshCcw className={`h-4 w-4 ${isBalanceFetching ? "animate-spin" : ""}`} />
                            Refresh balance
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit redeem"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <RedeemCreditsModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                amount={Number(amount) || 0}
                accountLabel={accountLabel}
                accountNumber={accountNumber}
                note={note}
                payoutAmount={payoutAmount}
                isLoading={isSubmitting}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
