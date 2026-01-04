import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  useCreateBankAccount,
  useDeleteBankAccount,
  useMyBankAccounts,
  useUpdateBankAccount,
} from '../hooks/useBankAccount';
import { CreateBankAccountDto, UpdateBankAccountDto } from '../types';

// Form values interface
interface FinancialFormValues {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// Validation schema
const validationSchema = Yup.object({
  bankName: Yup.string()
    .required('Bank name is required')
    .max(100, 'Bank name must not exceed 100 characters'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .max(50, 'Account number must not exceed 50 characters'),
  accountName: Yup.string().max(
    100,
    'Account name must not exceed 100 characters',
  ),
});

// Form field component for edit mode
interface FormFieldRowProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

function FormFieldRow({
  label,
  name,
  placeholder,
  required = false,
}: FormFieldRowProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-2">
        <Field
          as={Input}
          id={name}
          name={name}
          placeholder={placeholder}
          className="flex-1"
        />
        <Edit className="h-4 w-4 text-gray-400" />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500"
      />
    </div>
  );
}

// Display field component for view mode
interface DisplayFieldRowProps {
  label: string;
  value: string;
}

function DisplayFieldRow({ label, value }: DisplayFieldRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <div className="w-full text-sm font-medium text-gray-700 md:w-48 md:flex-shrink-0">
        {label}
      </div>
      <div className="flex-1 break-words text-sm text-gray-900">{value}</div>
    </div>
  );
}

export default function FinancialDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState<{
    accountNumber: string;
    bankName: string;
  } | null>(null);

  const { data: bankAccounts, isLoading, isError, error } = useMyBankAccounts();
  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();

  const emptyFormValues: FinancialFormValues = {
    bankName: '',
    accountNumber: '',
    accountName: '',
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingAccount(null);
  };

  const handleEdit = (accountNumber: string, bankName: string) => {
    setEditingAccount({ accountNumber, bankName });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingAccount(null);
  };

  const handleDelete = (accountNumber: string, bankName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the bank account at ${bankName}?`,
      )
    ) {
      deleteMutation.mutate({ accountNumber, bankName });
    }
  };

  const handleSubmit = (
    values: FinancialFormValues,
    { setSubmitting, resetForm }: FormikHelpers<FinancialFormValues>,
  ) => {
    if (isAdding) {
      const data: CreateBankAccountDto = {
        accountNumber: values.accountNumber,
        bankName: values.bankName,
        accountName: values.accountName || null,
      };

      createMutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          setIsAdding(false);
          setSubmitting(false);
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    } else if (isEditing && editingAccount) {
      const data: UpdateBankAccountDto = {
        accountNumber: values.accountNumber,
        bankName: values.bankName,
        accountName: values.accountName || null,
      };

      updateMutation.mutate(
        {
          accountNumber: editingAccount.accountNumber,
          bankName: editingAccount.bankName,
          data,
        },
        {
          onSuccess: () => {
            resetForm();
            setIsEditing(false);
            setEditingAccount(null);
            setSubmitting(false);
          },
          onSettled: () => {
            setSubmitting(false);
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
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
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Financial Details
        </h1>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading bank accounts</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  // If adding or editing, show the form
  if (isAdding || (isEditing && editingAccount)) {
    const currentAccount = editingAccount
      ? bankAccounts?.find(
          (acc) =>
            acc.accountNumber === editingAccount.accountNumber &&
            acc.bankName === editingAccount.bankName,
        )
      : null;

    const initialValues: FinancialFormValues = currentAccount
      ? {
          bankName: currentAccount.bankName,
          accountNumber: currentAccount.accountNumber,
          accountName: currentAccount.accountName || '',
        }
      : emptyFormValues;

    return (
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          {isAdding ? 'Add Bank Account' : 'Edit Bank Account'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <FormFieldRow
                label="Bank Name"
                name="bankName"
                placeholder="Enter bank name"
                required
              />
              <FormFieldRow
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number"
                required
              />
              <FormFieldRow
                label="Account Name"
                name="accountName"
                placeholder="Enter account name"
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  {isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isAdding ? 'Adding...' : 'Updating...'}
                    </>
                  ) : isAdding ? (
                    'Add Account'
                  ) : (
                    'Update Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={
                    isSubmitting ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    );
  }

  // Display view - show all bank accounts
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Financial Details
        </h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      {bankAccounts && bankAccounts.length > 0 ? (
        <div className="space-y-6">
          {bankAccounts.map((account) => (
            <Card
              key={`${account.accountNumber}-${account.bankName}`}
              className="p-6"
            >
              <div className="space-y-4">
                <DisplayFieldRow label="Bank Name" value={account.bankName} />
                <DisplayFieldRow
                  label="Account Number"
                  value={account.accountNumber}
                />
                <DisplayFieldRow
                  label="Account Name"
                  value={account.accountName || 'N/A'}
                />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleEdit(account.accountNumber, account.bankName)
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleDelete(account.accountNumber, account.bankName)
                  }
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="py-8 text-center text-gray-500">
            No bank accounts found. Click "Add Bank Account" to add one.
          </div>
        </Card>
      )}
    </div>
  );
}
