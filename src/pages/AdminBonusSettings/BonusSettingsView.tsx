import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type Props = {
  settings: {
    baseBonusCredits: number;
    conversionRate: number;
    date: number;
  };
  onEdit: () => void;
};

export default function BonusSettingsView({ settings, onEdit }: Props) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Bonus Credit Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Core Settings */}
        <InfoBlock
          label="Base Bonus Credits"
          value={formatNumber(settings.baseBonusCredits)}
          helper="Granted to each eligible user every month"
        />

        <InfoBlock
          label="Conversion Rate"
          value={`1 Credit = ${formatNumber(settings.conversionRate)} VND`}
          helper="Defines the monetary value of a single bonus credit in VND."
        />

        <InfoBlock
          label="Credit Day"
          value={`Day ${settings.date} of every month`}
          helper="To ensure consistent monthly distribution, selectable days are limited to 1–28."
        />

        {/* Business Warnings */}
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-yellow-800 font-medium">
            <AlertTriangle size={16} />
            Important
          </div>

          <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li>Changes apply to future bonus distributions only</li>
            <li>Modifying these settings affects all eligible users</li>
            <li>Issued bonus credits cannot be automatically reversed</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={onEdit}>Update Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBlock({
  label,
  value,
  helper,
}: {
  label: string;
  value: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-xl font-semibold mt-1 text-gray-900">
        {value}
      </p>
      {helper && (
        <p className="text-xs text-muted-foreground mt-1">
          {helper}
        </p>
      )}
    </div>
  );
}
function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
