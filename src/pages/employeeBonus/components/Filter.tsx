import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { subDays, startOfMonth } from "date-fns";
import { toDateString } from "../utils/dateFormatters";
import { TransactionType } from "../types/transaction";
import { TRANSACTION_META } from "../constants/transactionMeta";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  isInvalidRange: boolean;
  selectedTypes: TransactionType[];
  onTypesChange: (types: TransactionType[]) => void;
}

export function Filter({
  from,
  to,
  onFromChange,
  onToChange,
  isInvalidRange,
  selectedTypes,
  onTypesChange,
}: DateRangeFilterProps) {
  const today = new Date();

  const allTypes: TransactionType[] = [
    "MONTHLY",
    "AWARD",
    "TRANSFER_RECEIVED",
    "TRANSFER_SENT",
    "REDEEM",
    "DEDUCT",
  ];

  const toggleType = (type: TransactionType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const toggleAll = () => {
    if (selectedTypes.length === allTypes.length) {
      onTypesChange([]);
    } else {
      onTypesChange([...allTypes]);
    }
  };

  const handleLast7Days = () => {
    onFromChange(toDateString(subDays(today, 7)));
    onToChange(toDateString(today));
  };

  const handleLast30Days = () => {
    onFromChange(toDateString(subDays(today, 30)));
    onToChange(toDateString(today));
  };

  const handleThisMonth = () => {
    onFromChange(toDateString(startOfMonth(today)));
    onToChange(toDateString(today));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLast7Days}
          >
            Last 7 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLast30Days}
          >
            Last 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleThisMonth}
          >
            This month
          </Button>
        </div>

        {/* Custom range */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="date"
              value={from}
              max={to}
              onChange={(e) => onFromChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => onToChange(e.target.value)}
            />
          </div>
        </div>

        {isInvalidRange && (
          <p className="text-sm text-red-500">
            "From" date cannot be after "To" date
          </p>
        )}

        {/* Transaction Type Filter */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-base">Transaction Types</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
            >
              {selectedTypes.length === allTypes.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                <Label
                  htmlFor={type}
                  className="text-sm font-normal cursor-pointer"
                >
                  {TRANSACTION_META[type].label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
