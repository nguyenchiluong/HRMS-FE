import { Card } from '@/components/ui/card';
import {
  addMonths,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';
import {
  useDepartments,
  useEmploymentTypes,
  useJobLevels,
  usePositions,
  useTimeTypes,
} from '../../hooks/useLookups';

export default function JobDetails() {
  const {
    data: employee,
    isLoading: employeeLoading,
    isError: employeeError,
    error,
  } = useCurrentEmployee();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: positions, isLoading: positionsLoading } = usePositions();
  const { data: jobLevels, isLoading: jobLevelsLoading } = useJobLevels();
  const { data: employmentTypes, isLoading: employmentTypesLoading } =
    useEmploymentTypes();
  const { data: timeTypes, isLoading: timeTypesLoading } = useTimeTypes();

  const isLoading =
    employeeLoading ||
    departmentsLoading ||
    positionsLoading ||
    jobLevelsLoading ||
    employmentTypesLoading ||
    timeTypesLoading;

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className="flex w-full flex-col p-6">
        <h2 className="mb-6 text-xl font-medium text-gray-900">Job Details</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (employeeError || !employee) {
    return (
      <Card className="flex w-full flex-col p-6">
        <h2 className="mb-6 text-xl font-medium text-gray-900">Job Details</h2>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading job details</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  // Lookup functions
  const getDepartmentName = (id?: number | null): string => {
    if (!id || !departments) return 'N/A';
    const dept = departments.find((d) => d.id === id);
    return dept?.name || 'N/A';
  };

  const getPositionName = (id?: number | null): string => {
    if (!id || !positions) return 'N/A';
    const pos = positions.find((p) => p.id === id);
    return pos?.title || 'N/A';
  };

  const getJobLevelName = (id?: number | null): string => {
    if (!id || !jobLevels) return 'N/A';
    const level = jobLevels.find((l) => l.id === id);
    return level?.name || 'N/A';
  };

  const getEmploymentTypeName = (id?: number | null): string => {
    if (!id || !employmentTypes) return 'N/A';
    const type = employmentTypes.find((t) => t.id === id);
    return type?.name || 'N/A';
  };

  const getTimeTypeName = (id?: number | null): string => {
    if (!id || !timeTypes) return 'N/A';
    const type = timeTypes.find((t) => t.id === id);
    return type?.name || 'N/A';
  };

  // Calculate length of service (years, months, and days of service)
  const calculateServiceLength = (startDate?: string | null): string => {
    if (!startDate) return 'N/A';
    
    const start = new Date(startDate);
    const now = new Date();
    
    // Check if start date is in the future
    if (start > now) return 'N/A';
    
    const totalYears = differenceInYears(now, start);
    const totalMonths = differenceInMonths(now, start);
    
    // Calculate remaining months after years
    const months = totalMonths - totalYears * 12;
    
    // Calculate remaining days after months
    // Create a date that is totalMonths from start
    const dateAfterMonths = addMonths(start, totalMonths);
    const days = differenceInDays(now, dateAfterMonths);
    
    const parts: string[] = [];
    // Always show years and months, even if 0
    parts.push(`${totalYears} ${totalYears === 1 ? 'year' : 'years'}`);
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    
    // Only show days if greater than 0
    if (days > 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }
    
    return parts.join(', ');
  };

  const jobDetailsData = [
    {
      label: 'Employee ID',
      value: employee.id?.toString() || 'N/A',
    },
    {
      label: 'Work Email',
      value: employee.email || 'N/A',
    },
    {
      label: 'Position',
      value: getPositionName(employee.positionId),
    },
    {
      label: 'Job Level',
      value: getJobLevelName(employee.jobLevelId),
    },
    {
      label: 'Department',
      value: getDepartmentName(employee.departmentId),
    },
    {
      label: 'Employee Type',
      value: getEmploymentTypeName(employee.employmentTypeId),
    },
    {
      label: 'Time Type',
      value: getTimeTypeName(employee.timeTypeId),
    },
  ];

  const serviceDates = [
    {
      label: 'Original Hiring Date',
      value: formatDate(employee.startDate),
    },
    {
      label: 'Continuous Service Date',
      value: formatDate(employee.startDate),
    },
    {
      label: 'Length of Services',
      value: calculateServiceLength(employee.startDate),
    },
  ];

  return (
    <Card className="flex w-full flex-col p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900">Job Details</h2>
      </div>

      <div className="space-y-6">
        {/* Job Details Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">
            Employee Information
          </h3>
          {jobDetailsData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start"
            >
              <div className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
                {item.label}
              </div>
              <div className="flex-1 break-words text-sm text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Service Dates Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">Service Dates</h3>
          {serviceDates.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start"
            >
              <div className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
                {item.label}
              </div>
              <div className="flex-1 break-words text-sm text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
