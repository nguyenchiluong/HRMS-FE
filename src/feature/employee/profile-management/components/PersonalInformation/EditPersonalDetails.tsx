import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, FieldProps } from 'formik';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { updateCurrentEmployee } from '../../api';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';
import { UpdateProfileDto } from '../../types';

interface PersonalDetailsForm {
  fullName: string;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  pronoun: string;
  personalEmail: string;
  permanentAddress: string;
  currentAddress: string;
  phoneNumber1: string;
  phoneNumber2: string;
  preferredName: string;
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  preferredName: Yup.string(),
  personalEmail: Yup.string().test(
    'email',
    'Please enter a valid email address',
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  ),
  phoneNumber1: Yup.string().required('Phone number is required'),
  phoneNumber2: Yup.string(),
  sex: Yup.string().required('Sex is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  pronoun: Yup.string(),
  permanentAddress: Yup.string().required('Permanent address is required'),
  currentAddress: Yup.string().required('Current address is required'),
});

export default function EditPersonalDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUserName = useAuthStore((state) => state.updateUserName);
  const { data: employee, isLoading: isLoadingEmployee } = useCurrentEmployee();

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => updateCurrentEmployee(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentEmployee'], data);
      // Update auth store with new user name
      const newUserName = data.preferredName || data.fullName;
      if (newUserName) {
        updateUserName(newUserName);
      }
      toast.success('Profile updated successfully!');
      navigate('/employee/profile/personal-info');
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update profile';
      if (error && typeof error === 'object') {
        if (
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response
        ) {
          const data = error.response.data as { message?: string };
          errorMessage = data.message || errorMessage;
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
      console.error('Update error:', error);
    },
  });

  const handleCancel = () => {
    navigate('/employee/profile/personal-info');
  };

  const getInitialValues = (): PersonalDetailsForm => {
    if (!employee) {
      return {
        fullName: '',
        sex: '',
        dateOfBirth: '',
        maritalStatus: '',
        pronoun: '',
        personalEmail: '',
        permanentAddress: '',
        currentAddress: '',
        phoneNumber1: '',
        phoneNumber2: '',
        preferredName: '',
        firstName: '',
        lastName: '',
      };
    }

    return {
      fullName: employee.fullName || '',
      sex: employee.sex || '',
      dateOfBirth: employee.dateOfBirth || '',
      maritalStatus: employee.maritalStatus || '',
      pronoun: employee.pronoun || '',
      personalEmail: employee.personalEmail || '',
      permanentAddress: employee.permanentAddress || '',
      currentAddress: employee.currentAddress || '',
      phoneNumber1: employee.phone || '',
      phoneNumber2: employee.phone2 || '',
      preferredName: employee.preferredName || '',
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
    };
  };

  const handleSubmit = (values: PersonalDetailsForm) => {
    const updateData: UpdateProfileDto = {
      preferredName: values.preferredName || undefined,
      sex: values.sex || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      maritalStatus: values.maritalStatus || undefined,
      pronoun: values.pronoun || undefined,
      personalEmail: values.personalEmail || undefined,
      phone: values.phoneNumber1 || undefined,
      phone2: values.phoneNumber2 || undefined,
      permanentAddress: values.permanentAddress || undefined,
      currentAddress: values.currentAddress || undefined,
    };

    updateMutation.mutate(updateData);
  };

  if (isLoadingEmployee) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </Card>
    );
  }

  const formFields = [
    {
      key: 'fullName' as keyof PersonalDetailsForm,
      label: 'Full Name',
      type: 'text',
      readOnly: true,
    },
    {
      key: 'firstName' as keyof PersonalDetailsForm,
      label: 'First Name',
      type: 'text',
      readOnly: true,
    },
    {
      key: 'lastName' as keyof PersonalDetailsForm,
      label: 'Last Name',
      type: 'text',
      readOnly: true,
    },
    {
      key: 'preferredName' as keyof PersonalDetailsForm,
      label: 'Preferred Name',
      type: 'text',
    },
    {
      key: 'personalEmail' as keyof PersonalDetailsForm,
      label: 'Personal Email',
      type: 'text',
    },
    {
      key: 'phoneNumber1' as keyof PersonalDetailsForm,
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      key: 'phoneNumber2' as keyof PersonalDetailsForm,
      label: 'Phone Number (2)',
      type: 'text',
    },
    {
      key: 'sex' as keyof PersonalDetailsForm,
      label: 'Sex',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      required: true,
    },
    {
      key: 'dateOfBirth' as keyof PersonalDetailsForm,
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      key: 'maritalStatus' as keyof PersonalDetailsForm,
      label: 'Marital Status',
      type: 'select',
      options: ['Single', 'Married', 'Divorced', 'Widowed'],
      required: true,
    },
    {
      key: 'pronoun' as keyof PersonalDetailsForm,
      label: 'Pronoun',
      type: 'select',
      options: ['he/him', 'she/her', 'they/them', 'other'],
    },
    {
      key: 'permanentAddress' as keyof PersonalDetailsForm,
      label: 'Permanent Address',
      type: 'text',
      required: true,
    },
    {
      key: 'currentAddress' as keyof PersonalDetailsForm,
      label: 'Current Address',
      type: 'text',
      required: true,
    },
  ];

  return (
    <Card className="flex h-full w-full min-h-0 flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleCancel} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors: formikErrors, touched, setFieldValue, isSubmitting, dirty }) => (
          <>
            <Form className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
              {formFields.map((field) => (
                <div
                  key={field.key}
                  className="font-regular flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start"
                >
                  <Label
                    htmlFor={field.key}
                    className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0"
                  >
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <div className="flex-1 space-y-1">
                    {field.type === 'select' && field.options ? (
                      <Field name={field.key}>
                        {({ field: formikField }: FieldProps) => (
                          <Select
                            value={formikField.value}
                            onValueChange={(value) => setFieldValue(field.key, value)}
                          >
                            <SelectTrigger
                              id={field.key}
                              className={cn(
                                formikErrors[field.key] &&
                                  touched[field.key] &&
                                  'border-red-500',
                              )}
                            >
                              <SelectValue
                                placeholder={`Select ${field.label.toLowerCase()}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                    ) : field.type === 'date' ? (
                      <Field name={field.key}>
                        {({ field: formikField }: FieldProps) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !formikField.value && 'text-muted-foreground',
                                  formikErrors[field.key] &&
                                    touched[field.key] &&
                                    'border-red-500',
                                )}
                                type="button"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {formikField.value
                                    ? format(new Date(formikField.value), 'PPP')
                                    : `Select ${field.label.toLowerCase()}`}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  formikField.value
                                    ? new Date(formikField.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    const formattedDate = format(date, 'yyyy-MM-dd');
                                    setFieldValue(field.key, formattedDate);
                                  }
                                }}
                                captionLayout="dropdown"
                                startMonth={new Date(1950, 0, 1)}
                                endMonth={new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </Field>
                    ) : (
                      <Field name={field.key}>
                        {({ field: formikField }: FieldProps) => (
                          <Input
                            id={field.key}
                            type="text"
                            {...formikField}
                            disabled={field.readOnly}
                            className={cn(
                              formikErrors[field.key] &&
                                touched[field.key] &&
                                'border-red-500',
                              field.readOnly && 'cursor-not-allowed bg-gray-50',
                            )}
                          />
                        )}
                      </Field>
                    )}
                    {formikErrors[field.key] && touched[field.key] && (
                      <p className="text-sm text-red-500">
                        {formikErrors[field.key]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex shrink-0 justify-end border-t border-gray-100 bg-white pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || updateMutation.isPending || !dirty}
              >
                {isSubmitting || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Changes'
                )}
              </Button>
            </div>
          </Form>
          </>
        )}
      </Formik>
    </Card>
  );
}
