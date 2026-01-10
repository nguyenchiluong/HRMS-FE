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
import { AlertTriangle } from "lucide-react";

interface ConfirmSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    settings: {
        baseBonusCredits: number;
        conversionRate: number;
        date: number;
    };
    isLoading: boolean;
    onConfirm: () => void;
}

export function ConfirmSettingsModal({
    open,
    onOpenChange,
    settings,
    isLoading,
    onConfirm,
}: ConfirmSettingsModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Settings Update</AlertDialogTitle>
                    <AlertDialogDescription>
                        Review the changes before applying them to the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <Card className="border bg-muted/50 p-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Base Bonus Credits
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {settings.baseBonusCredits.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">per eligible user every month</p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Conversion Rate
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    1 Credit = {settings.conversionRate.toLocaleString()} VND
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Credit Day
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    Day {settings.date} of every month
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium">These changes will:</p>
                            <ul className="mt-1 list-disc list-inside space-y-0.5">
                                <li>Apply to all future bonus distributions</li>
                                <li>Affect all eligible users system-wide</li>
                                <li>Cannot be automatically reversed</li>
                            </ul>
                        </div>
                    </div>

                    <AlertDialogDescription className="text-center text-sm font-medium">
                        This action will update the global bonus credit settings.
                    </AlertDialogDescription>
                </div>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Confirm Update"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
