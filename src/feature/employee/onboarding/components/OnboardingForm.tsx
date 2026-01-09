import { Button } from '@/components/ui/button';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  useOnboarding,
  useSaveOnboardingProgress,
} from '../hooks/useOnboarding';
import {
  OnboardingFormValues,
  OnboardingInfo,
  transformFormToPayload,
} from '../types';
import { FileUpload } from './ui/FileUpload';
import { FormRow } from './ui/FormRow';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
  sex: Yup.string().required('Sex is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  permanentAddress: Yup.string().required('Permanent address is required'),
  currentAddress: Yup.string().required('Current address is required'),
  identificationNumber: Yup.string().required('ID number is required'),
  socialInsuranceNumber: Yup.string().required('Social insurance is required'),
  taxId: Yup.string().required('Tax ID is required'),
  bankName: Yup.string().required('Bank name is required'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^\d+$/, 'Account number must contain only digits')
    .min(8, 'Account number must be at least 8 digits')
    .max(20, 'Account number must not exceed 20 digits'),
  accountName: Yup.string().required('Account name is required'),
  swiftCode: Yup.string()
    .max(11, 'SWIFT code must not exceed 11 characters')
    .matches(
      /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      'Invalid SWIFT code format (e.g., CHASUS33)',
    )
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  branchCode: Yup.string()
    .max(20, 'Branch code must not exceed 20 characters')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

const defaultValues: OnboardingFormValues = {
  firstName: '',
  lastName: '',
  sex: '',
  dateOfBirth: '',
  maritalStatus: '',
  personalEmail: '',
  permanentAddress: '',
  currentAddress: '',
  phone: '',
  identificationNumber: '',
  socialInsuranceNumber: '',
  taxId: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  swiftCode: '',
  branchCode: '',
  educations: [],
  attachments: [],
};

// Helper to convert OnboardingInfo to form values (for pre-populating saved data)
const mapOnboardingInfoToFormValues = (
  info: OnboardingInfo,
): OnboardingFormValues => ({
  firstName: info.firstName ?? '',
  lastName: info.lastName ?? '',
  sex: info.sex ?? '',
  dateOfBirth: info.dateOfBirth ?? '',
  maritalStatus: info.maritalStatus ?? '',
  personalEmail: info.personalEmail ?? '',
  permanentAddress: info.permanentAddress ?? '',
  currentAddress: info.currentAddress ?? '',
  phone: info.phone ?? '',
  identificationNumber: info.nationalId?.number ?? '',
  socialInsuranceNumber: info.socialInsuranceNumber ?? '',
  taxId: info.taxId ?? '',
  bankName: info.bankAccount?.bankName ?? '',
  accountNumber: info.bankAccount?.accountNumber ?? '',
  accountName: info.bankAccount?.accountName ?? '',
  swiftCode: info.bankAccount?.swiftCode ?? '',
  branchCode: info.bankAccount?.branchCode ?? '',
  educations:
    info.education?.map((edu) => ({
      degree: edu.degree ?? '',
      fieldOfStudy: edu.fieldOfStudy ?? '',
      institution: edu.institution ?? '',
      startYear: edu.startYear?.toString() ?? '',
      endYear: edu.endYear?.toString() ?? '',
    })) ?? [],
  attachments: [],
});

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6">
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </h3>
    <div className="space-y-1">{children}</div>
  </div>
);

interface OnboardingFormProps {
  employeeId: number;
  token: string;
  initialData?: OnboardingInfo;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  employeeId,
  token,
  initialData,
}) => {
  const navigate = useNavigate();

  const { mutate: submitOnboarding, isPending: isSubmitPending } =
    useOnboarding(employeeId, {
      onSuccess: () => {
        navigate(`/onboarding/success?token=${encodeURIComponent(token)}`);
      },
    });

  const { mutate: saveProgress, isPending: isSavePending } =
    useSaveOnboardingProgress(token);

  // Pre-populate form with saved data if available
  const initialValues = useMemo(() => {
    if (initialData) {
      return mapOnboardingInfoToFormValues(initialData);
    }
    return defaultValues;
  }, [initialData]);

  const handleSubmit = (
    values: OnboardingFormValues,
    { setSubmitting }: FormikHelpers<OnboardingFormValues>,
  ) => {
    const payload = transformFormToPayload(values);
    submitOnboarding(payload, {
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-6">
          {/* Personal Information */}
          <Section title="Personal Information">
            <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
              <FormRow label="First Name" name="firstName" required />
              <FormRow label="Last Name" name="lastName" required />
            </div>
            <FormRow label="Phone Number" name="phone" required />
            <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
              <FormRow
                label="Sex"
                name="sex"
                type="select"
                options={['Male', 'Female', 'Other']}
                required
              />
              <FormRow
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
              />
            </div>
            <FormRow
              label="Marital Status"
              name="maritalStatus"
              type="select"
              options={['Single', 'Married', 'Divorced', 'Widowed']}
              required
            />
          </Section>

          {/* Address */}
          <Section title="Address">
            <FormRow
              label="Permanent Address"
              name="permanentAddress"
              required
            />
            <FormRow label="Current Address" name="currentAddress" required />
          </Section>

          {/* Identification */}
          <Section title="Identification">
            <FormRow
              label="National ID Number"
              name="identificationNumber"
              required
            />
            <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
              <FormRow
                label="Social Insurance #"
                name="socialInsuranceNumber"
                required
              />
              <FormRow label="Tax ID" name="taxId" required />
            </div>
          </Section>

          {/* Bank Account */}
          <Section title="Bank Account">
            <FormRow
              label="Bank Name"
              name="bankName"
              type="select"
              options={[
                'Vietcombank',
                'ACB',
                'Techcombank',
                'BIDV',
                'VietinBank',
                'TPBank',
              ]}
              required
            />
            <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
              <FormRow
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number (digits only)"
                required
              />
              <FormRow
                label="Account Holder Name"
                name="accountName"
                placeholder="Name as it appears on the account"
                uppercase
                required
              />
            </div>
            <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
              <FormRow
                label="SWIFT Code"
                name="swiftCode"
                placeholder="e.g., CHASUS33 (optional)"
              />
              <FormRow
                label="Branch Code"
                name="branchCode"
                placeholder="Enter branch code (optional)"
              />
            </div>
          </Section>

          {/* Education - Optional */}
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Education{' '}
                <span className="font-normal normal-case text-slate-400">
                  (optional)
                </span>
              </h3>
            </div>
            <FieldArray name="educations">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.educations.map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                          Education #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <FormRow
                          label="Degree"
                          name={`educations.${index}.degree`}
                          type="select"
                          options={[
                            'High School',
                            'Associate',
                            'Bachelor',
                            'Master',
                            'PhD',
                          ]}
                        />
                        <FormRow
                          label="Field of Study"
                          name={`educations.${index}.fieldOfStudy`}
                        />
                        <FormRow
                          label="Institution"
                          name={`educations.${index}.institution`}
                        />
                        <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
                          <FormRow
                            label="Start Year"
                            name={`educations.${index}.startYear`}
                            type="number"
                            placeholder="e.g., 2018"
                          />
                          <FormRow
                            label="End Year"
                            name={`educations.${index}.endYear`}
                            type="number"
                            placeholder="e.g., 2022 (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                  onClick={() =>
                    push({
                      degree: '',
                      fieldOfStudy: '',
                      institution: '',
                      startYear: '',
                      endYear: '',
                    })
                  }
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Education
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Attachments */}
          {/* <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Documents
            </h3>
            <FileUpload />
          </div> */}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-w-[150px] rounded-lg"
              disabled={isSubmitting || isSavePending || isSubmitPending}
              onClick={() => {
                const payload = transformFormToPayload(values);
                saveProgress(payload);
              }}
            >
              {isSavePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Progress
                </>
              )}
            </Button>
            <Button
              type="submit"
              size="lg"
              className="min-w-[200px] rounded-lg"
              disabled={isSubmitting || isSavePending || isSubmitPending}
            >
              {isSubmitting || isSubmitPending
                ? 'Submitting...'
                : 'Complete Onboarding'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
