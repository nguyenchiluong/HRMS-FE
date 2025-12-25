import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  EmployeeType,
  InitialProfileFormData,
  JobLevel,
  TimeType,
} from '@/types/employee';
import { useFormik } from 'formik';
import { Loader2, X } from 'lucide-react';
import { usePositions } from '../hooks/usePositions';
import { useDepartments } from '../hooks/useDepartments';
import { useCreateInitialProfile } from '../hooks/useCreateInitialProfile';
import * as Yup from 'yup';

interface OnboardEmployeeModalProps {
  onClose: () => void;
}

const JOB_LEVELS: JobLevel[] = [
  'Intern',
  'Fresher',
  'Junior',
  'Middle',
  'Senior',
  'Lead',
  'Manager',
];
const EMPLOYEE_TYPES: EmployeeType[] = [
  'FullTime',
  'PartTime',
  'Contract',
  'Intern',
];
const TIME_TYPES: TimeType[] = ['OnSite', 'Remote', 'Hybrid'];

const initialProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  positionId: Yup.number()
    .required('Position is required')
    .positive('Please select a position'),
  jobLevel: Yup.string()
    .required('Job level is required')
    .oneOf(
      ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager'],
      'Invalid job level',
    ),
  departmentId: Yup.number()
    .required('Department is required')
    .positive('Please select a department'),
  employeeType: Yup.string()
    .required('Employee type is required')
    .oneOf(
      ['FullTime', 'PartTime', 'Contract', 'Intern'],
      'Invalid employee type',
    ),
  timeType: Yup.string()
    .required('Time type is required')
    .oneOf(['OnSite', 'Remote', 'Hybrid'], 'Invalid time type'),
  startDate: Yup.string()
    .required('Start date is required')
    .test('not-in-past', 'Start date cannot be in the past', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      return selectedDate >= today;
    }),
});

export default function OnboardEmployeeModal({
  onClose,
}: OnboardEmployeeModalProps) {
  const { data: positions, isLoading: positionsLoading } = usePositions();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const createMutation = useCreateInitialProfile({ onSuccess: onClose });

  const formik = useFormik<InitialProfileFormData>({
    initialValues: {
      fullName: '',
      email: '',
      positionId: '',
      jobLevel: '',
      departmentId: '',
      employeeType: '',
      timeType: '',
      startDate: '',
    },
    validationSchema: initialProfileSchema,
    onSubmit: (values) => {
      createMutation.mutate({
        fullName: values.fullName,
        email: values.email,
        positionId: Number(values.positionId),
        jobLevel: values.jobLevel as string,
        departmentId: Number(values.departmentId),
        employeeType: values.employeeType as string,
        timeType: values.timeType as string,
        startDate: values.startDate,
      });
    },
  });

  const isLoading = positionsLoading || departmentsLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-[#253D90]">
            Onboard New Employee
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#253D90]" />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.fullName && formik.errors.fullName
                    ? 'border-red-500'
                    : ''
                }
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-sm text-red-500">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : ''
                }
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="positionId">Position *</Label>
              <Select
                value={formik.values.positionId.toString()}
                onValueChange={(value) =>
                  formik.setFieldValue('positionId', Number(value))
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.positionId && formik.errors.positionId
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions?.map((position) => (
                    <SelectItem
                      key={position.id}
                      value={position.id.toString()}
                    >
                      {position.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.positionId && formik.errors.positionId && (
                <p className="text-sm text-red-500">
                  {formik.errors.positionId}
                </p>
              )}
            </div>

            {/* Job Level */}
            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job Level *</Label>
              <Select
                value={formik.values.jobLevel}
                onValueChange={(value) =>
                  formik.setFieldValue('jobLevel', value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.jobLevel && formik.errors.jobLevel
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select job level" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.jobLevel && formik.errors.jobLevel && (
                <p className="text-sm text-red-500">{formik.errors.jobLevel}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formik.values.departmentId.toString()}
                onValueChange={(value) =>
                  formik.setFieldValue('departmentId', Number(value))
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.departmentId && formik.errors.departmentId
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id.toString()}
                    >
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.departmentId && formik.errors.departmentId && (
                <p className="text-sm text-red-500">
                  {formik.errors.departmentId}
                </p>
              )}
            </div>

            {/* Employee Type */}
            <div className="space-y-2">
              <Label htmlFor="employeeType">Employee Type *</Label>
              <Select
                value={formik.values.employeeType}
                onValueChange={(value) =>
                  formik.setFieldValue('employeeType', value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.employeeType && formik.errors.employeeType
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.employeeType && formik.errors.employeeType && (
                <p className="text-sm text-red-500">
                  {formik.errors.employeeType}
                </p>
              )}
            </div>

            {/* Time Type */}
            <div className="space-y-2">
              <Label htmlFor="timeType">Time Type *</Label>
              <Select
                value={formik.values.timeType}
                onValueChange={(value) =>
                  formik.setFieldValue('timeType', value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.timeType && formik.errors.timeType
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select time type" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.timeType && formik.errors.timeType && (
                <p className="text-sm text-red-500">{formik.errors.timeType}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.startDate && formik.errors.startDate
                    ? 'border-red-500'
                    : ''
                }
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-sm text-red-500">
                  {formik.errors.startDate}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#253D90] hover:bg-[#1a2d6b]"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Employee'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}