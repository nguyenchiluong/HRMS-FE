import { Loader2 } from 'lucide-react';
import { useCurrentEmployee } from '../hooks/useCurrentEmployee';
import { useDepartments, usePositions, useJobLevels, useEmploymentTypes, useTimeTypes } from '../hooks/useLookups';

interface InfoRow {
  label: string;
  value: string;
}

function InfoRowComponent({ label, value }: InfoRow) {
  return (
    <div className="flex items-start gap-[45px] py-[5px]">
      <div className="w-[180px] md:w-[240px] text-black font-medium text-[17px]">
        {label}
      </div>
      <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
        {value}
      </div>
    </div>
  );
}

export default function JobDetailsContent() {
  const { data: employee, isLoading: employeeLoading, isError: employeeError, error } = useCurrentEmployee();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: positions, isLoading: positionsLoading } = usePositions();
  const { data: jobLevels, isLoading: jobLevelsLoading } = useJobLevels();
  const { data: employmentTypes, isLoading: employmentTypesLoading } = useEmploymentTypes();
  const { data: timeTypes, isLoading: timeTypesLoading } = useTimeTypes();

  const isLoading = employeeLoading || departmentsLoading || positionsLoading || 
                    jobLevelsLoading || employmentTypesLoading || timeTypesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[30px] w-full">
        <div className="flex items-center justify-center p-[30px] md:p-[45px] rounded-[25px] bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (employeeError || !employee) {
    return (
      <div className="flex flex-col gap-[30px] w-full">
        <div className="flex flex-col items-center justify-center p-[30px] md:p-[45px] rounded-[25px] bg-white gap-4">
          <p className="text-red-500">Error loading job details</p>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  // Lookup functions
  const getDepartmentName = (id?: number | null): string => {
    if (!id || !departments) return 'N/A';
    const dept = departments.find(d => d.id === id);
    return dept?.name || 'N/A';
  };

  const getPositionName = (id?: number | null): string => {
    if (!id || !positions) return 'N/A';
    const pos = positions.find(p => p.id === id);
    return pos?.title || 'N/A';
  };

  const getJobLevelName = (id?: number | null): string => {
    if (!id || !jobLevels) return 'N/A';
    const level = jobLevels.find(l => l.id === id);
    return level?.name || 'N/A';
  };

  const getEmploymentTypeName = (id?: number | null): string => {
    if (!id || !employmentTypes) return 'N/A';
    const type = employmentTypes.find(t => t.id === id);
    return type?.name || 'N/A';
  };

  const getTimeTypeName = (id?: number | null): string => {
    if (!id || !timeTypes) return 'N/A';
    const type = timeTypes.find(t => t.id === id);
    return type?.name || 'N/A';
  };

  // Calculate length of service
  const calculateServiceLength = (startDate?: string | null): string => {
    if (!startDate) return 'N/A';
    
    try {
      const start = new Date(startDate);
      const now = new Date();
      
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      
      if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const parts = [];
      if (years > 0) parts.push(`${years} year(s)`);
      if (months > 0) parts.push(`${months} month(s)`);
      if (days > 0) parts.push(`${days} day(s)`);
      
      return parts.length > 0 ? parts.join(', ') : '0 days';
    } catch {
      return 'N/A';
    }
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return 'N/A';
    }
  };

  const jobDetailsData: InfoRow[] = [
    { label: "Employee ID", value: employee.id?.toString() || 'N/A' },
    { label: "Work Email", value: employee.email || 'N/A' },
    { label: "Position", value: getPositionName(employee.positionId) },
    { label: "Job Level", value: getJobLevelName(employee.jobLevelId) },
    { label: "Department", value: getDepartmentName(employee.departmentId) },
    { label: "Employee Type", value: getEmploymentTypeName(employee.employmentTypeId) },
    { label: "Time Type", value: getTimeTypeName(employee.timeTypeId) },
  ];

  const contactInfo: InfoRow[] = [
    { label: "Work Email", value: employee.email || 'N/A' },
  ];

  const serviceDates: InfoRow[] = [
    { label: "Original Hiring Date", value: formatDate(employee.startDate) },
    { label: "Continuous Service Date", value: formatDate(employee.startDate) },
    { label: "Length of Services", value: calculateServiceLength(employee.startDate) },
  ];

  return (
    <div className="flex flex-col gap-[30px] w-full">
      {/* Job Details and Contact Information Row */}
      <div className="flex flex-col lg:flex-row gap-[35px] p-[30px] md:px-[45px] md:py-[30px] rounded-[25px] bg-white">
        {/* Job Details Section */}
        <div className="flex flex-col gap-5 flex-1">
          <h2 className="text-black text-[25px] font-semibold">Job Details</h2>
          <div className="flex flex-col gap-2.5 py-2.5">
            {jobDetailsData.map((item) => (
              <InfoRowComponent key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col gap-5 flex-1 lg:max-w-[400px]">
          <h2 className="text-black text-[25px] font-semibold">Contact Information</h2>
          <div className="flex flex-col gap-2.5 py-2.5">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-[45px] py-[5px]">
                <div className="w-[102px] text-black font-medium text-[17px]">
                  {item.label}
                </div>
                <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Dates Section */}
      <div className="flex flex-col gap-5 p-[30px] md:px-[45px] md:py-[30px] rounded-[25px] bg-white">
        <h2 className="text-black text-[25px] font-semibold">Service Dates</h2>
        <div className="flex flex-col gap-2.5 py-2.5">
          {serviceDates.map((item) => (
            <div key={item.label} className="flex items-start gap-[45px] py-[5px] px-2.5">
              <div className="w-[240px] text-black font-medium text-[17px]">
                {item.label}
              </div>
              <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}