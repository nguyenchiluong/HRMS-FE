import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RedeemableItem } from "../types/redeem";

interface RedeemableCardProps {
    item: RedeemableItem;
    onRedeem: (item: RedeemableItem) => void;
    disabled?: boolean;
}

export function RedeemableCard({ item, onRedeem, disabled }: RedeemableCardProps) {
    const isOutOfStock = item.inventory !== undefined && item.inventory !== null && item.inventory <= 0;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                        <CardDescription>{item.description ?? "Redeem this reward with your credits"}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                        {item.category}
                    </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.deliveryType === "PHYSICAL" ? "Physical" : "Digital"}</span>
                    {item.estimatedDeliveryDays != null && (
                        <span>• {item.estimatedDeliveryDays}d fulfillment</span>
                    )}
                    {item.inventory != null && (
                        <span className={isOutOfStock ? "text-red-600" : undefined}>
                            • {isOutOfStock ? "Out of stock" : `${item.inventory} available`}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Cost</p>
                        <p className="text-2xl font-semibold">{item.cost.toLocaleString()} pts</p>
                    </div>
                    {item.maxPerRequest && (
                        <p className="text-xs text-muted-foreground">Up to {item.maxPerRequest} per request</p>
                    )}
                </div>

                <Button
                    className="mt-auto"
                    onClick={() => onRedeem(item)}
                    disabled={disabled || isOutOfStock}
                >
                    {isOutOfStock ? "Unavailable" : "Redeem"}
                </Button>
            </CardContent>
        </Card>
    );
}
