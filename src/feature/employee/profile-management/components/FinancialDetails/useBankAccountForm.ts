import { useState } from 'react';
import {
  useCreateBankAccount,
  useDeleteBankAccount,
  useUpdateBankAccount,
} from '../../hooks/useBankAccount';
import { CreateBankAccountDto } from '../../types';
import { FinancialFormValues } from './BankAccountForm';

export function useBankAccountForm(accountId?: number) {
  const [isEditing, setIsEditing] = useState(false);

  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = async (values: FinancialFormValues, isNewAccount: boolean) => {
    const data: CreateBankAccountDto = {
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      accountName: values.accountName || null,
      swiftCode: values.swiftCode || null,
      branchCode: values.branchCode || null,
    };

    if (isNewAccount) {
      // Create new account
      return new Promise<void>((resolve, reject) => {
        createMutation.mutate(data, {
          onSuccess: () => {
            setIsEditing(false);
            resolve();
          },
          onError: reject,
        });
      });
    }

    // Update existing account
    if (!accountId) {
      throw new Error('Account ID is required for update');
    }

    return new Promise<void>((resolve, reject) => {
      updateMutation.mutate(
        {
          id: accountId,
          data,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            resolve();
          },
          onError: reject,
        }
      );
    });
  };

  return {
    isEditing,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
