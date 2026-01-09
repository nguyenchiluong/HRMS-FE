import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceSummaryCardProps {
  balance: number | null | undefined;
  lastUpdated?: Date;
}

export function BalanceSummaryCard({ balance, lastUpdated }: BalanceSummaryCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="w-full md:max-w-[240px]">
      <Card className="w-full md:w-auto">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {balance != null ? balance.toLocaleString() : "—"}
          </div>
          {lastUpdated && (
            <div className="text-xs text-muted-foreground mt-2">
              Updated {formatTime(lastUpdated)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
