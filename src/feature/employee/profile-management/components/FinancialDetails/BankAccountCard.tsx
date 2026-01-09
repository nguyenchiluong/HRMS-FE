import { Card } from '@/components/ui/card';
import { BankAccountRecordDto } from '../../types';
import { DisplayFieldRow } from './DisplayFieldRow';

interface BankAccountCardProps {
  account: BankAccountRecordDto;
}

export function BankAccountCard({ account }: BankAccountCardProps) {
  const formatValue = (value: string | null | undefined): string => {
    if (!value || value.trim() === '') {
      return 'N/A';
    }
    return value;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <DisplayFieldRow label="Bank Name" value={formatValue(account.bankName)} />
        <DisplayFieldRow
          label="Account Number"
          value={formatValue(account.accountNumber)}
        />
        <DisplayFieldRow
          label="Account Holder Name"
          value={formatValue(account.accountName)}
        />
        <DisplayFieldRow label="SWIFT Code" value={formatValue(account.swiftCode)} />
        <DisplayFieldRow label="Branch Code" value={formatValue(account.branchCode)} />
      </div>
    </Card>
  );
}
