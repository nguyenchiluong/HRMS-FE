import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// --------------------
// Types
// --------------------

type BalanceHistoryItem = {
  id: number;
  type: "REDEEM" | "TRANSFER";
  points: number;
  amount: number | null;
  note: string | null;
  counterpartyId: number | null;
  counterpartyName: string | null;
  currency: string | null;
  createdAt: string;
};

type BalanceResponse = {
  empId: number;
  currentBalance: number;
  totalRedeemed: number | null;
  totalSent: number | null;
  totalReceived: number | null;
  history: BalanceHistoryItem[];
};

// --------------------
// API fetcher
// --------------------

async function fetchBalance(): Promise<BalanceResponse> {
  const res = await fetch("http://localhost:8080/api/credits/view");
  if (!res.ok) {
    throw new Error("Failed to fetch balance");
  }
  return res.json();
}

// --------------------
// Component
// --------------------

export default function ViewBalance() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
  });

  if (isLoading) {
    return <div className="p-4">Loading balance...</div>;
  }

  if (error || !data) {
    return <div className="p-4 text-red-500">Failed to load balance</div>;
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {data.currentBalance.toLocaleString()} pts
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Employee ID: {data.empId}
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Balance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.history.map((item) => (
                <TableRow key={`${item.type}-${item.id}-${item.createdAt}`}>
                  <TableCell>
                    {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell
                    className={
                      item.points < 0
                        ? "text-red-600 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    {item.points}
                  </TableCell>
                  <TableCell>
                    {item.amount != null && item.currency
                      ? `${item.amount} ${item.currency}`
                      : "-"}
                  </TableCell>
                  <TableCell>{item.counterpartyName ?? "-"}</TableCell>
                  <TableCell>{item.note ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
