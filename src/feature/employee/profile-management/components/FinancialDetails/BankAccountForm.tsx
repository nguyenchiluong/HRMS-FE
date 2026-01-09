import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, Formik } from 'formik';
import { Loader2 } from 'lucide-react';
import * as Yup from 'yup';
import { BankAccountRecordDto } from '../../types';
import { FormFieldRow } from './FormFieldRow';

export interface FinancialFormValues {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
  branchCode: string;
}

// SWIFT code validation: 8-11 alphanumeric characters
const swiftCodeRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const validationSchema = Yup.object({
  bankName: Yup.string()
    .required('Bank name is required')
    .max(100, 'Bank name must not exceed 100 characters'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^\d+$/, 'Account number must contain only digits')
    .min(8, 'Account number must be at least 8 digits')
    .max(20, 'Account number must not exceed 20 digits'),
  accountName: Yup.string()
    .required('Account name is required')
    .max(100, 'Account name must not exceed 100 characters'),
  swiftCode: Yup.string()
    .max(11, 'SWIFT code must not exceed 11 characters')
    .matches(swiftCodeRegex, 'Invalid SWIFT code format (e.g., CHASUS33)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  branchCode: Yup.string()
    .max(20, 'Branch code must not exceed 20 characters')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

interface BankAccountFormProps {
  mode: 'add' | 'edit';
  initialAccount?: BankAccountRecordDto | null;
  onSubmit: (values: FinancialFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BankAccountForm({
  mode,
  initialAccount,
  onSubmit,
  onCancel,
  isSubmitting,
}: BankAccountFormProps) {
  const initialValues: FinancialFormValues = initialAccount
    ? {
        bankName: initialAccount.bankName,
        accountNumber: initialAccount.accountNumber,
        accountName: initialAccount.accountName || '',
        swiftCode: initialAccount.swiftCode || '',
        branchCode: initialAccount.branchCode || '',
      }
    : {
        bankName: '',
        accountNumber: '',
        accountName: '',
        swiftCode: '',
        branchCode: '',
      };

  const handleSubmit = async (values: FinancialFormValues) => {
    await onSubmit(values);
  };

  return (
    <Card className="p-6">
      <h1 className="mb-6 text-xl font-medium text-gray-900">
        {mode === 'add' ? 'Add Bank Account' : 'Edit Bank Account'}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormFieldRow
              label="Bank Name"
              name="bankName"
              placeholder="Enter bank name"
              required
            />
            <FormFieldRow
              label="Account Number"
              name="accountNumber"
              placeholder="Enter account number (digits only)"
              required
            />
          </div>

          <FormFieldRow
            label="Account Holder Name"
            name="accountName"
            placeholder="Name as it appears on the account"
            required
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormFieldRow
              label="SWIFT Code"
              name="swiftCode"
              placeholder="e.g., CHASUS33 (optional)"
            />
            <FormFieldRow
              label="Branch Code"
              name="branchCode"
              placeholder="Enter branch code (optional)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'add' ? 'Saving...' : 'Updating...'}
                </>
              ) : mode === 'add' ? (
                'Save Account'
              ) : (
                'Update Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Formik>
    </Card>
  );
}
