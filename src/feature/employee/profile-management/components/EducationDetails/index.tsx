import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useField,
} from 'formik';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  useCreateEducation,
  useDeleteEducation,
  useMyEducations,
  useUpdateEducation,
} from '../../hooks/useEducation';
import { CreateEducationDto, UpdateEducationDto } from '../../types';

interface EducationFormValues {
  country: string;
  degree: string;
  fieldOfStudy: string;
  averageGrade: string;
}

const validationSchema = Yup.object({
  country: Yup.string(),
  degree: Yup.string()
    .required('Degree is required')
    .max(200, 'Degree must not exceed 200 characters'),
  fieldOfStudy: Yup.string().max(
    200,
    'Field of study must not exceed 200 characters',
  ),
  averageGrade: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0.0, 'GPA must be at least 0.0')
    .max(4.0, 'GPA must not exceed 4.0'),
});

interface FormFieldRowProps {
  label: string;
  name: string;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

function FormFieldRow({
  label,
  name,
  type = 'text',
  options = [],
  placeholder,
  required = false,
}: FormFieldRowProps) {
  if (type === 'select') {
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
          <SelectFieldRow name={name} options={options} />
        </div>
      </div>
    );
  }

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
        <Field
          as={Input}
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
        />
        <ErrorMessage
          name={name}
          component="div"
          className="text-sm text-red-500"
        />
      </div>
    </div>
  );
}

function SelectFieldRow({
  name,
  options,
}: {
  name: string;
  options: { value: string; label: string }[];
}) {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <Select
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
      >
        <SelectTrigger
          id={name}
          className={meta.error && meta.touched ? 'border-red-500' : ''}
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
    </>
  );
}

interface DisplayFieldRowProps {
  label: string;
  value: string;
}

function DisplayFieldRow({ label, value }: DisplayFieldRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <div className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
        {label}
      </div>
      <div className="flex-1 break-words text-sm text-gray-900">{value}</div>
    </div>
  );
}

const countryOptions = [
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Singapore', label: 'Singapore' },
];

const degreeOptions = [
  { value: 'High School', label: 'High School' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorate', label: 'Doctorate' },
];

const fieldOfStudyOptions = [
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Business Administration', label: 'Business Administration' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Economics', label: 'Economics' },
  { value: 'Other', label: 'Other' },
];

export default function EducationDetails() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<number | null>(
    null,
  );

  const { data: educations, isLoading, isError, error } = useMyEducations();
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();
  const deleteMutation = useDeleteEducation();

  const emptyFormValues: EducationFormValues = {
    country: '',
    degree: '',
    fieldOfStudy: '',
    averageGrade: '',
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingEducationId(null);
  };

  const handleEdit = (id: number) => {
    setEditingEducationId(id);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingEducationId(null);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm('Are you sure you want to delete this education record?')
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (
    values: EducationFormValues,
    { setSubmitting, resetForm }: FormikHelpers<EducationFormValues>,
  ) => {
    if (isAdding) {
      const data: CreateEducationDto = {
        degree: values.degree,
        fieldOfStudy: values.fieldOfStudy || null,
        gpa: values.averageGrade ? parseFloat(values.averageGrade) : null,
        country: values.country || null,
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
    } else if (isEditing && editingEducationId) {
      const data: UpdateEducationDto = {
        degree: values.degree,
        fieldOfStudy: values.fieldOfStudy || null,
        gpa: values.averageGrade ? parseFloat(values.averageGrade) : null,
        country: values.country || null,
      };

      updateMutation.mutate(
        { id: editingEducationId, data },
        {
          onSuccess: () => {
            resetForm();
            setIsEditing(false);
            setEditingEducationId(null);
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
        <h1 className="mb-6 text-xl font-medium text-gray-900">Education</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-medium text-gray-900">Education</h1>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading education records</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  // If adding or editing, show the form
  if (isAdding || (isEditing && editingEducationId)) {
    const currentEducation = editingEducationId
      ? educations?.find((e) => e.id === editingEducationId)
      : null;

    const initialValues: EducationFormValues = currentEducation
      ? {
          country: currentEducation.country || '',
          degree: currentEducation.degree || '',
          fieldOfStudy: currentEducation.fieldOfStudy || '',
          averageGrade: currentEducation.gpa?.toString() || '',
        }
      : emptyFormValues;

    return (
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-medium text-gray-900">
          {isAdding ? 'Add Education' : 'Edit Education'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormFieldRow
                label="Country"
                name="country"
                type="select"
                options={countryOptions}
              />
              <FormFieldRow
                label="Degree"
                name="degree"
                type="select"
                options={degreeOptions}
                required
              />
              <FormFieldRow
                label="Field of Study"
                name="fieldOfStudy"
                type="select"
                options={fieldOfStudyOptions}
              />
              <FormFieldRow
                label="Average Grade (GPA)"
                name="averageGrade"
                type="text"
                placeholder="3.65"
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
                    'Add Education'
                  ) : (
                    'Update Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
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

  // Display view - show all education records
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Education</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {educations && educations.length > 0 ? (
        <div className="space-y-6">
          {educations.map((education) => (
            <Card key={education.id} className="p-6">
              <div className="space-y-4">
                {education.country && (
                  <DisplayFieldRow label="Country" value={education.country} />
                )}
                <DisplayFieldRow label="Degree" value={education.degree} />
                {education.fieldOfStudy && (
                  <DisplayFieldRow
                    label="Field of Study"
                    value={education.fieldOfStudy}
                  />
                )}
                {education.gpa && (
                  <DisplayFieldRow
                    label="GPA"
                    value={`${education.gpa.toFixed(2)}/4.0`}
                  />
                )}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleEdit(education.id)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDelete(education.id)}
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
            No education records found. Click &quot;Add Education&quot; to add
            one.
          </div>
        </Card>
      )}
    </div>
  );
}
