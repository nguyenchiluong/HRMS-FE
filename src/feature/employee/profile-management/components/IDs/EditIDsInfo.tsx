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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { FormikProps } from 'formik';
import { ErrorMessage, Field, Form, Formik, useField } from 'formik';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  File,
  FileText,
  Image,
  Loader2,
  X,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { updateCurrentEmployee } from '../../api';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';
import { UpdateProfileDto } from '../../types';

interface FormFieldRowProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function FormFieldRow({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: FormFieldRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <Label
        htmlFor={name}
        className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="flex-1 space-y-1">
        {type === 'date' ? (
          <DateFieldRow name={name} />
        ) : type === 'textarea' ? (
          <>
            <Field
              as={Textarea}
              name={name}
              placeholder={placeholder}
              className="min-h-[100px]"
            />
            <ErrorMessage
              name={name}
              component="div"
              className="text-sm text-red-500"
            />
          </>
        ) : (
          <>
            <Field
              as={Input}
              name={name}
              type={type}
              placeholder={placeholder}
            />
            <ErrorMessage
              name={name}
              component="div"
              className="text-sm text-red-500"
            />
          </>
        )}
      </div>
    </div>
  );
}

function DateFieldRow({ name }: { name: string }) {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !field.value && 'text-muted-foreground',
              meta.error && meta.touched && 'border-red-500',
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {field.value
                ? format(new Date(field.value), 'PPP')
                : 'Select date'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => {
              if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                helpers.setValue(formattedDate);
              }
            }}
          />
        </PopoverContent>
      </Popover>
      {meta.error && meta.touched && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </>
  );
}

interface SelectFieldRowProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

function SelectFieldRow({
  label,
  name,
  options,
  required,
}: SelectFieldRowProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <Label
        htmlFor={name}
        className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="flex-1 space-y-1">
        <Select
          value={field.value}
          onValueChange={(value) => helpers.setValue(value)}
        >
          <SelectTrigger
            id={name}
            className={cn(meta.error && meta.touched && 'border-red-500')}
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {meta.error && meta.touched && (
          <p className="text-sm text-red-500">{meta.error}</p>
        )}
      </div>
    </div>
  );
}

interface FormValues {
  firstName: string;
  lastName: string;
  nationality: string;
  nationalIdNumber: string;
  nationalIdIssuedDate: string;
  nationalIdExpirationDate: string;
  nationalIdIssuedBy: string;
  socialInsuranceNumber: string;
  taxIdNumber: string;
  comment: string;
  attachments: FileList | null;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  nationality: Yup.string().required('Nationality is required'),
  nationalIdNumber: Yup.string().required('National ID number is required'),
  nationalIdIssuedDate: Yup.string().required('Issued date is required'),
  nationalIdExpirationDate: Yup.string()
    .required('Expiration date is required')
    .test(
      'is-after-issued',
      'Expiration date must be after issued date',
      function (this: Yup.TestContext, value: string) {
        const { nationalIdIssuedDate } = this.parent;
        if (!value || !nationalIdIssuedDate) return true;
        return new Date(value) > new Date(nationalIdIssuedDate);
      },
    ),
  nationalIdIssuedBy: Yup.string().required('Issued by is required'),
  socialInsuranceNumber: Yup.string().required(
    'Social insurance number is required',
  ),
  taxIdNumber: Yup.string().required('Tax ID number is required'),
  comment: Yup.string(),
  attachments: Yup.mixed()
    .required('Attachments are required')
    .test('fileSize', 'Each file must be less than 10MB', (value) => {
      if (!value) return true;
      const files = Array.from(value as FileList);
      return files.every((file) => file.size <= 10 * 1024 * 1024);
    }),
});

const nationalityOptions = [
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'China', label: 'China' },
  { value: 'India', label: 'India' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Malaysia', label: 'Malaysia' },
];

export default function EditIDsContent() {
  const fileUrlsRef = useRef<Map<File, string>>(new Map());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: employee, isLoading } = useCurrentEmployee();

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => updateCurrentEmployee(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentEmployee'], data);
      toast.success('IDs updated successfully!');
      navigate(-1);
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update IDs';
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

  const handleSubmit = (values: FormValues) => {
    const updateData: UpdateProfileDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      nationalId: {
        country: values.nationality,
        number: values.nationalIdNumber,
        issuedDate: values.nationalIdIssuedDate,
        expirationDate: values.nationalIdExpirationDate,
        issuedBy: values.nationalIdIssuedBy,
      },
      socialInsuranceNumber: values.socialInsuranceNumber,
      taxId: values.taxIdNumber,
    };

    updateMutation.mutate(updateData);
  };

  const initialValues: FormValues = {
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    nationality: employee?.nationalIdCountry || '',
    nationalIdNumber: employee?.nationalIdNumber || '',
    nationalIdIssuedDate: employee?.nationalIdIssuedDate || '',
    nationalIdExpirationDate: employee?.nationalIdExpirationDate || '',
    nationalIdIssuedBy: employee?.nationalIdIssuedBy || '',
    socialInsuranceNumber: employee?.socialInsuranceNumber || '',
    taxIdNumber: employee?.taxId || '',
    comment: '',
    attachments: null,
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    const fileUrls = fileUrlsRef.current;
    return () => {
      fileUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      fileUrls.clear();
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Edit Your IDs
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
          Edit Your IDs
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">Edit Your IDs</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          errors,
          touched,
          values,
        }: FormikProps<FormValues>) => (
          <Form className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <FormFieldRow label="First Name" name="firstName" required />
                <FormFieldRow label="Last Name" name="lastName" required />
                <SelectFieldRow
                  label="Nationality"
                  name="nationality"
                  options={nationalityOptions}
                  required
                />
              </div>

              {/* National ID Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">
                  National ID
                </h3>
                <FormFieldRow
                  label="Identification #"
                  name="nationalIdNumber"
                  required
                />
                <FormFieldRow
                  label="Issued Date"
                  name="nationalIdIssuedDate"
                  type="date"
                  required
                />
                <FormFieldRow
                  label="Expiration Date"
                  name="nationalIdExpirationDate"
                  type="date"
                  required
                />
                <FormFieldRow
                  label="Issued By"
                  name="nationalIdIssuedBy"
                  required
                />
              </div>

              {/* Social Insurance Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Social Insurance Number ID
                </h3>
                <FormFieldRow
                  label="Identification #"
                  name="socialInsuranceNumber"
                  required
                />
              </div>

              {/* Tax ID Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Tax ID
                </h3>
                <FormFieldRow
                  label="Identification #"
                  name="taxIdNumber"
                  required
                />
              </div>

              {/* Comment Section */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-start">
                  <Label className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
                    Your comment
                  </Label>
                  <div className="flex-1 space-y-1">
                    <Field
                      as={Textarea}
                      name="comment"
                      placeholder="Enter your comment..."
                      className="min-h-[100px]"
                    />
                    <ErrorMessage
                      name="comment"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-start">
                  <Label className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
                    Attachments <span className="ml-1 text-red-500">*</span>
                  </Label>
                  <div className="flex-1 space-y-1">
                    <div className="relative flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <input
                        type="file"
                        multiple
                        onChange={(event) => {
                          const newFiles = event.currentTarget.files;
                          if (newFiles && newFiles.length > 0) {
                            const dt = new DataTransfer();
                            // Add existing files
                            if (values.attachments) {
                              Array.from(values.attachments).forEach((file) =>
                                dt.items.add(file),
                              );
                            }
                            // Add new files
                            Array.from(newFiles).forEach((file) =>
                              dt.items.add(file),
                            );
                            setFieldValue('attachments', dt.files);
                          }
                        }}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        accept="*/*"
                        id="file-input"
                      />
                      {!values.attachments ||
                      values.attachments.length === 0 ? (
                        <label
                          htmlFor="file-input"
                          className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          Select files
                        </label>
                      ) : (
                        <label
                          htmlFor="file-input"
                          className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          Add more files
                        </label>
                      )}
                    </div>

                    {values.attachments && values.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {Array.from(values.attachments).map((file, index) => {
                          const isImage = file.type.startsWith('image/');
                          const fileSize = (file.size / 1024).toFixed(2);
                          const fileIcon = isImage
                            ? Image
                            : file.type.includes('pdf')
                              ? FileText
                              : File;
                          const FileIcon = fileIcon;
                          const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

                          // Get or create object URL for images
                          let imageUrl = '';
                          if (isImage) {
                            if (!fileUrlsRef.current.has(file)) {
                              const url = URL.createObjectURL(file);
                              fileUrlsRef.current.set(file, url);
                            }
                            imageUrl = fileUrlsRef.current.get(file) || '';
                          }

                          return (
                            <div
                              key={fileKey}
                              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                            >
                              {isImage ? (
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                                  <img
                                    src={imageUrl}
                                    alt={file.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white">
                                  <FileIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {Number(fileSize) > 1024
                                    ? `${(Number(fileSize) / 1024).toFixed(2)} MB`
                                    : `${fileSize} KB`}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  // Clean up object URL if it's an image
                                  if (
                                    isImage &&
                                    fileUrlsRef.current.has(file)
                                  ) {
                                    const url = fileUrlsRef.current.get(file);
                                    if (url) {
                                      URL.revokeObjectURL(url);
                                    }
                                    fileUrlsRef.current.delete(file);
                                  }

                                  const dt = new DataTransfer();
                                  Array.from(values.attachments || []).forEach(
                                    (f, i) => {
                                      if (i !== index) {
                                        dt.items.add(f);
                                      }
                                    },
                                  );
                                  setFieldValue(
                                    'attachments',
                                    dt.files.length > 0 ? dt.files : null,
                                  );
                                }}
                                className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-200"
                                aria-label="Remove file"
                              >
                                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {errors.attachments && touched.attachments && (
                      <p className="text-sm text-red-500">
                        {errors.attachments}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex shrink-0 justify-end border-t border-gray-100 pt-6">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="min-w-[150px]"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Request Changes'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
