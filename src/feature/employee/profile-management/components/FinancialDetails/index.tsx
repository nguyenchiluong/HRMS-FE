import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Loader2 } from 'lucide-react';
import { useMyBankAccount } from '../../hooks/useBankAccount';
import { BankAccountCard } from './BankAccountCard';
import { BankAccountForm, FinancialFormValues } from './BankAccountForm';
import { useBankAccountForm } from './useBankAccountForm';

export default function FinancialDetails() {
  const { data: bankAccount, isLoading, isError, error } = useMyBankAccount();
  const {
    isEditing,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSubmit,
    isSubmitting,
    isDeleting,
  } = useBankAccountForm(bankAccount?.id);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-medium text-gray-900">
          Financial Details
        </h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-medium text-gray-900">
          Financial Details
        </h1>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading bank account</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  // If editing or no account exists, show the form
  if (isEditing || !bankAccount) {
    return (
      <BankAccountForm
        mode={!bankAccount ? 'add' : 'edit'}
        initialAccount={bankAccount || null}
        onSubmit={async (values: FinancialFormValues) => {
          await handleSubmit(values, !bankAccount);
        }}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Display view - show the bank account
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Financial Details</h1>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Bank Account
        </Button>
      </div>

      <BankAccountCard
        account={bankAccount}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
