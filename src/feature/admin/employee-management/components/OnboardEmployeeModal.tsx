import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import type { InitialProfileFormData } from '@/types/employee';
import { useFormik } from 'formik';
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';
import { useCreateInitialProfile } from '../hooks/useCreateInitialProfile';
import { useDepartments } from '../hooks/useDepartments';
import { useEmploymentTypes } from '../hooks/useEmploymentTypes';
import { useHrPersonnel } from '../hooks/useHrPersonnel';
import { useJobLevels } from '../hooks/useJobLevels';
import { useManagers } from '../hooks/useManagers';
import { usePositions } from '../hooks/usePositions';
import { useTimeTypes } from '../hooks/useTimeTypes';

interface OnboardEmployeeModalProps {
  onClose: () => void;
}

const createInitialProfileSchema = (
  jobLevelIds: number[],
  employmentTypeIds: number[],
  timeTypeIds: number[],
) =>
  Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    personalEmail: Yup.string()
      .required('Personal email is required')
      .email('Invalid email format'),
    positionId: Yup.number()
      .required('Position is required')
      .positive('Please select a position'),
    jobLevelId: Yup.number()
      .required('Job level is required')
      .oneOf(jobLevelIds, 'Invalid job level'),
    departmentId: Yup.number()
      .required('Department is required')
      .positive('Please select a department'),
    employmentTypeId: Yup.number()
      .required('Employment type is required')
      .oneOf(employmentTypeIds, 'Invalid employment type'),
    timeTypeId: Yup.number()
      .required('Time type is required')
      .oneOf(timeTypeIds, 'Invalid time type'),
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
  const { data: jobLevels, isLoading: jobLevelsLoading } = useJobLevels();
  const { data: employmentTypes, isLoading: employmentTypesLoading } =
    useEmploymentTypes();
  const { data: timeTypes, isLoading: timeTypesLoading } = useTimeTypes();
  const createMutation = useCreateInitialProfile({ onSuccess: onClose });
  const [managerOpen, setManagerOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');
  const [hrSearch, setHrSearch] = useState('');

  const jobLevelIds = jobLevels?.map((level) => level.id) ?? [];
  const employmentTypeIds = employmentTypes?.map((type) => type.id) ?? [];
  const timeTypeIds = timeTypes?.map((type) => type.id) ?? [];

  const formik = useFormik<InitialProfileFormData>({
    initialValues: {
      fullName: '',
      personalEmail: '',
      positionId: '',
      jobLevelId: '',
      departmentId: '',
      employmentTypeId: '',
      timeTypeId: '',
      startDate: '',
      managerId: '',
      hrId: '',
    },
    validationSchema: createInitialProfileSchema(
      jobLevelIds,
      employmentTypeIds,
      timeTypeIds,
    ),
    enableReinitialize: true,
    onSubmit: (values) => {
      createMutation.mutate({
        fullName: values.fullName,
        personalEmail: values.personalEmail,
        positionId: Number(values.positionId),
        jobLevelId: Number(values.jobLevelId),
        departmentId: Number(values.departmentId),
        employmentTypeId: Number(values.employmentTypeId),
        timeTypeId: Number(values.timeTypeId),
        startDate: values.startDate,
        managerId: values.managerId ? Number(values.managerId) : null,
        hrId: values.hrId ? Number(values.hrId) : null,
      });
    },
  });

  // Fetch managers with search - fetch when popover opens
  const {
    data: managersData = [],
    isLoading: managersLoading,
  } = useManagers({
    search: managerSearch || undefined,
    enabled: managerOpen, // Only fetch when popover is open
  });

  // Fetch HR personnel with search - fetch when popover opens
  const {
    data: hrData = [],
    isLoading: hrLoading,
  } = useHrPersonnel({
    search: hrSearch || undefined,
    enabled: hrOpen, // Only fetch when popover is open
  });

  const isLoading =
    positionsLoading ||
    departmentsLoading ||
    jobLevelsLoading ||
    employmentTypesLoading ||
    timeTypesLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-semibold">Onboard New Employee</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

            {/* Personal Email */}
            <div className="space-y-2">
              <Label htmlFor="personalEmail">Personal Email *</Label>
              <Input
                id="personalEmail"
                name="personalEmail"
                type="email"
                placeholder="Enter personal email address"
                value={formik.values.personalEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.personalEmail && formik.errors.personalEmail
                    ? 'border-red-500'
                    : ''
                }
              />
              {formik.touched.personalEmail && formik.errors.personalEmail && (
                <p className="text-sm text-red-500">
                  {formik.errors.personalEmail}
                </p>
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
              <Label htmlFor="jobLevelId">Job Level *</Label>
              <Select
                value={formik.values.jobLevelId.toString()}
                onValueChange={(value) =>
                  formik.setFieldValue('jobLevelId', Number(value))
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.jobLevelId && formik.errors.jobLevelId
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select job level" />
                </SelectTrigger>
                <SelectContent>
                  {jobLevels?.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.jobLevelId && formik.errors.jobLevelId && (
                <p className="text-sm text-red-500">
                  {formik.errors.jobLevelId}
                </p>
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

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employmentTypeId">Employment Type *</Label>
              <Select
                value={formik.values.employmentTypeId.toString()}
                onValueChange={(value) =>
                  formik.setFieldValue('employmentTypeId', Number(value))
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.employmentTypeId &&
                    formik.errors.employmentTypeId
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.employmentTypeId &&
                formik.errors.employmentTypeId && (
                  <p className="text-sm text-red-500">
                    {formik.errors.employmentTypeId}
                  </p>
                )}
            </div>

            {/* Time Type */}
            <div className="space-y-2">
              <Label htmlFor="timeTypeId">Time Type *</Label>
              <Select
                value={formik.values.timeTypeId.toString()}
                onValueChange={(value) =>
                  formik.setFieldValue('timeTypeId', Number(value))
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.timeTypeId && formik.errors.timeTypeId
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <SelectValue placeholder="Select time type" />
                </SelectTrigger>
                <SelectContent>
                  {timeTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.timeTypeId && formik.errors.timeTypeId && (
                <p className="text-sm text-red-500">
                  {formik.errors.timeTypeId}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formik.values.startDate && 'text-muted-foreground',
                      formik.touched.startDate && formik.errors.startDate
                        ? 'border-red-500'
                        : '',
                    )}
                    type="button"
                    onBlur={() => formik.setFieldTouched('startDate', true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {formik.values.startDate
                        ? format(new Date(formik.values.startDate), 'PPP')
                        : 'Select start date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formik.values.startDate
                        ? new Date(formik.values.startDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        formik.setFieldValue('startDate', formattedDate);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-sm text-red-500">
                  {formik.errors.startDate}
                </p>
              )}
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="managerId">Manager</Label>
              <Popover
                open={managerOpen}
                onOpenChange={(open) => {
                  setManagerOpen(open);
                  if (!open) {
                    setManagerSearch('');
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={managerOpen}
                    className="w-full justify-between"
                    type="button"
                    onBlur={() => formik.setFieldTouched('managerId', true)}
                  >
                    <span className="truncate">
                      {formik.values.managerId
                        ? managersData.find(
                            (emp) => Number(emp.id) === Number(formik.values.managerId),
                          )?.fullName || 'Select manager...'
                        : 'Select manager...'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search manager..."
                      value={managerSearch}
                      onValueChange={setManagerSearch}
                    />
                    <CommandList>
                      {managersLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No manager found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="none"
                              onSelect={() => {
                                formik.setFieldValue('managerId', '');
                                setManagerOpen(false);
                                setManagerSearch('');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  !formik.values.managerId
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              None (No Manager)
                            </CommandItem>
                            {managersData.map((employee) => (
                              <CommandItem
                                key={employee.id}
                                value={employee.fullName}
                                onSelect={() => {
                                  formik.setFieldValue('managerId', Number(employee.id));
                                  setManagerOpen(false);
                                  setManagerSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    Number(formik.values.managerId) === Number(employee.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {employee.fullName}
                                {employee.position && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({employee.position})
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formik.touched.managerId && formik.errors.managerId && (
                <p className="text-sm text-red-500">
                  {formik.errors.managerId}
                </p>
              )}
            </div>

            {/* HR */}
            <div className="space-y-2">
              <Label htmlFor="hrId">HR</Label>
              <Popover
                open={hrOpen}
                onOpenChange={(open) => {
                  setHrOpen(open);
                  if (!open) {
                    setHrSearch('');
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={hrOpen}
                    className="w-full justify-between"
                    type="button"
                    onBlur={() => formik.setFieldTouched('hrId', true)}
                  >
                    <span className="truncate">
                      {formik.values.hrId
                        ? hrData.find(
                            (hr) => Number(hr.id) === Number(formik.values.hrId),
                          )?.fullName || 'Select HR...'
                        : 'Select HR...'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search HR..."
                      value={hrSearch}
                      onValueChange={setHrSearch}
                    />
                    <CommandList>
                      {hrLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No HR found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="none"
                              onSelect={() => {
                                formik.setFieldValue('hrId', '');
                                setHrOpen(false);
                                setHrSearch('');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  !formik.values.hrId
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              None (No HR)
                            </CommandItem>
                            {hrData.map((hr) => (
                              <CommandItem
                                key={hr.id}
                                value={hr.fullName}
                                onSelect={() => {
                                  formik.setFieldValue('hrId', Number(hr.id));
                                  setHrOpen(false);
                                  setHrSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    Number(formik.values.hrId) === Number(hr.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {hr.fullName}
                                {hr.position && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({hr.position})
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formik.touched.hrId && formik.errors.hrId && (
                <p className="text-sm text-red-500">
                  {formik.errors.hrId}
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
                className="bg-primary hover:bg-primary/90"
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
