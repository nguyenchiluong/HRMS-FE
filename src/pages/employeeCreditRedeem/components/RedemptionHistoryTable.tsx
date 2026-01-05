import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RedeemHistoryItem } from "../types/redeem";

interface RedemptionHistoryTableProps {
    history: RedeemHistoryItem[];
    isLoading: boolean;
    isFetching: boolean;
}

export function RedemptionHistoryTable({ history, isLoading, isFetching }: RedemptionHistoryTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Redeem History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!history.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Redeem History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-8 text-center text-muted-foreground">No withdrawals yet</div>
                </CardContent>
            </Card>
        );
    }

    const badgeVariant = (status: RedeemHistoryItem["status"]) => {
        switch (status) {
            case "APPROVED":
            case "PAID":
                return "default" as const;
            case "PENDING":
                return "secondary" as const;
            case "REJECTED":
            default:
                return "destructive" as const;
        }
    };

    return (
        <Card className={isFetching ? "opacity-60" : ""}>
            <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Payout</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested</TableHead>
                            <TableHead>Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">{entry.amount.toLocaleString()} pts</TableCell>
                                <TableCell>{entry.fee != null ? entry.fee.toLocaleString() : "—"}</TableCell>
                                <TableCell>{entry.payoutAmount != null ? entry.payoutAmount.toLocaleString() : "—"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {entry.method}
                                    {entry.accountLabel ? ` • ${entry.accountLabel}` : ""}
                                    {entry.accountNumber ? ` • ${entry.accountNumber}` : ""}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={badgeVariant(entry.status)}>{entry.status}</Badge>
                                </TableCell>
                                <TableCell>{new Date(entry.requestedAt).toLocaleString()}</TableCell>
                                <TableCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : "—"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
