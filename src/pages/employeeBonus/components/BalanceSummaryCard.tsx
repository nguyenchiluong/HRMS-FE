import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceSummaryCardProps {
  balance: number | null | undefined;
}

export function BalanceSummaryCard({ balance }: BalanceSummaryCardProps) {
  return (
    <div className="w-full md:max-w-[240px]">
      <Card className="w-full md:w-auto">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {balance != null ? balance.toLocaleString() : "—"} pts
        </CardContent>
      </Card>
    </div>
  );
}
