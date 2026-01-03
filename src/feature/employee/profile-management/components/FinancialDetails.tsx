import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMyBankAccounts, useCreateBankAccount, useUpdateBankAccount, useDeleteBankAccount } from '../hooks/useBankAccount';
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
  accountName: Yup.string()
    .max(100, 'Account name must not exceed 100 characters'),
});

// Form field component for edit mode
interface FormFieldRowProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

function FormFieldRow({ label, name, placeholder, required = false }: FormFieldRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start px-2.5 py-[5px] gap-4 md:gap-[45px]">
      <label className="w-full md:w-[240px] text-black font-poppins text-[17px] font-medium flex-shrink-0">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <Field
            as={Input}
            name={name}
            placeholder={placeholder}
            className="flex-1 text-hrms-text-secondary font-poppins text-[17px] font-normal"
          />
          <Edit className="w-6 h-6 flex-shrink-0 text-hrms-text-muted" />
        </div>
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-sm font-poppins"
        />
      </div>
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
    <div className="flex flex-col md:flex-row md:items-start px-2.5 py-[5px] gap-4 md:gap-[45px]">
      <label className="w-full md:w-[240px] text-black font-poppins text-[17px] font-medium flex-shrink-0">
        {label}
      </label>
      <div className="flex-1 flex items-start md:items-center gap-2.5">
        <p className="flex-1 text-hrms-text-secondary font-poppins text-[17px] font-normal break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function FinancialDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState<{ accountNumber: string; bankName: string } | null>(null);

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
    if (window.confirm(`Are you sure you want to delete the bank account at ${bankName}?`)) {
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
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col p-[30px] md:p-[30px_45px] gap-[35px] rounded-[25px] bg-white">
        <h1 className="text-black font-poppins text-[25px] font-semibold">
          Financial Details
        </h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col p-[30px] md:p-[30px_45px] gap-[35px] rounded-[25px] bg-white">
        <h1 className="text-black font-poppins text-[25px] font-semibold">
          Financial Details
        </h1>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Error loading bank accounts</p>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  // If adding or editing, show the form
  if (isAdding || (isEditing && editingAccount)) {
    const currentAccount = editingAccount 
      ? bankAccounts?.find(acc => acc.accountNumber === editingAccount.accountNumber && acc.bankName === editingAccount.bankName)
      : null;

    const initialValues: FinancialFormValues = currentAccount
      ? {
          bankName: currentAccount.bankName,
          accountNumber: currentAccount.accountNumber,
          accountName: currentAccount.accountName || '',
        }
      : emptyFormValues;

    return (
      <div className="flex flex-col p-[30px] md:p-[30px_45px] gap-[35px] rounded-[25px] bg-white">
        <h1 className="text-black font-poppins text-[25px] font-semibold">
          {isAdding ? 'Add Bank Account' : 'Edit Bank Account'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="flex flex-col py-2.5 gap-2.5">
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
              </div>

              <div className="mt-[35px]">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[50px]">
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="flex items-center justify-center px-[38px] py-[15px] rounded-[25px] bg-hrms-primary hover:bg-hrms-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <span className="text-white font-poppins text-xl font-medium whitespace-nowrap">
                        {isAdding ? 'Add Account' : 'Update Changes'}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="flex items-center justify-center px-[48px] py-[15px] rounded-[25px] bg-hrms-bg-light hover:bg-hrms-bg-light/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-black font-poppins text-xl font-medium">
                      Cancel
                    </span>
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  // Display view - show all bank accounts
  return (
    <div className="flex flex-col p-[30px] md:p-[30px_45px] gap-[35px] rounded-[25px] bg-white">
      <h1 className="text-black font-poppins text-[25px] font-semibold">
        Financial Details
      </h1>

      {bankAccounts && bankAccounts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {bankAccounts.map((account) => (
            <div key={`${account.accountNumber}-${account.bankName}`} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex flex-col py-2.5 gap-2.5">
                <DisplayFieldRow label="Bank Name" value={account.bankName} />
                <DisplayFieldRow label="Account Number" value={account.accountNumber} />
                <DisplayFieldRow label="Account Name" value={account.accountName || 'N/A'} />
              </div>

              <div className="mt-[20px] flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleEdit(account.accountNumber, account.bankName)}
                  className="flex items-center justify-center w-full sm:w-[168px] py-[15px] rounded-[25px] bg-hrms-bg-light hover:bg-hrms-bg-light/80 transition-colors"
                >
                  <span className="text-black font-poppins text-xl font-medium">
                    EDIT
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(account.accountNumber, account.bankName)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete account"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Trash2 className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No bank accounts found. Click "Add Bank Account" to add one.
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-[25px] bg-hrms-primary hover:bg-hrms-primary/90 transition-colors text-white font-poppins text-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Bank Account
        </button>
      </div>
    </div>
  );
}
