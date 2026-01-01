import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Edit, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Input } from './ui/input';

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
    .min(2, 'Bank name must be at least 2 characters'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^[0-9]+$/, 'Account number must contain only digits')
    .min(6, 'Account number must be at least 6 digits'),
  accountName: Yup.string()
    .required('Account name is required')
    .min(2, 'Account name must be at least 2 characters'),
});

// Mock API function for updating financial details
const updateFinancialDetails = async (
  data: FinancialFormValues,
): Promise<FinancialFormValues> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Submitting financial details:', data);
  // Return the updated data (mock response)
  return data;
};

// Custom hook for the mutation
const useUpdateFinancialDetails = (options?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: updateFinancialDetails,
    onSuccess: () => {
      toast.success('Financial details updated successfully!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Failed to update financial details:', error);
      toast.error('Failed to update financial details. Please try again.');
    },
  });
};

// Form field component for edit mode
interface FormFieldRowProps {
  label: string;
  name: string;
  placeholder?: string;
}

function FormFieldRow({ label, name, placeholder }: FormFieldRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start px-2.5 py-[5px] gap-4 md:gap-[45px]">
      <label className="w-full md:w-[240px] text-black font-poppins text-[17px] font-medium flex-shrink-0">
        {label}
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

  // Initial form data (would normally come from API via useQuery)
  const initialValues: FinancialFormValues = {
    bankName:
      'BIDV - Joint Stock Commercial Bank for Investment and Development of Vietnam',
    accountNumber: '558100023',
    accountName: 'NGUYEN TUAN KIET',
  };

  // Mutation hook
  const { mutate: updateDetails, isPending } = useUpdateFinancialDetails({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (
    values: FinancialFormValues,
    { setSubmitting }: FormikHelpers<FinancialFormValues>,
  ) => {
    updateDetails(values, {
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="flex flex-col p-[30px] md:p-[30px_45px] gap-[35px] rounded-[25px] bg-white">
      {/* Title */}
      <h1 className="text-black font-poppins text-[25px] font-semibold">
        {isEditing ? 'Edit Financial Details' : 'Financial Details'}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, resetForm }) => (
          <Form>
            {/* Form Fields */}
            <div className="flex flex-col py-2.5 gap-2.5">
              {isEditing ? (
                <>
                  <FormFieldRow
                    label="Bank Name"
                    name="bankName"
                    placeholder="Enter bank name"
                  />
                  <FormFieldRow
                    label="Account Number"
                    name="accountNumber"
                    placeholder="Enter account number"
                  />
                  <FormFieldRow
                    label="Account Name"
                    name="accountName"
                    placeholder="Enter account name"
                  />
                </>
              ) : (
                <>
                  <DisplayFieldRow
                    label="Bank Name"
                    value={values.bankName}
                  />
                  <DisplayFieldRow
                    label="Account Number"
                    value={values.accountNumber}
                  />
                  <DisplayFieldRow
                    label="Account Name"
                    value={values.accountName}
                  />
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-[35px]">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center justify-center w-full sm:w-[168px] py-[15px] rounded-[25px] bg-hrms-bg-light hover:bg-hrms-bg-light/80 transition-colors"
                >
                  <span className="text-black font-poppins text-xl font-medium">
                    EDIT
                  </span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[50px]">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center px-[38px] py-[15px] rounded-[25px] bg-hrms-primary hover:bg-hrms-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <span className="text-white font-poppins text-xl font-medium whitespace-nowrap">
                        Update Changes
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsEditing(false);
                    }}
                    disabled={isPending}
                    className="flex items-center justify-center px-[48px] py-[15px] rounded-[25px] bg-hrms-bg-light hover:bg-hrms-bg-light/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-black font-poppins text-xl font-medium">
                      Cancel
                    </span>
                  </button>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
