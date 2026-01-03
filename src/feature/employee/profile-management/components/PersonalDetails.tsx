import { useNavigate } from "react-router-dom";
import { useCurrentEmployee } from "../hooks/useCurrentEmployee";
import { Loader2 } from "lucide-react";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { data: employee, isLoading, isError, error } = useCurrentEmployee();

  const handleEdit = () => {
    navigate("/employee/profile/personal-info/edit");
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
        <h2 className="text-xl lg:text-[25px] font-semibold text-black">
          Personal Details
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
        <h2 className="text-xl lg:text-[25px] font-semibold text-black">
          Personal Details
        </h2>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Error loading employee data</p>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
        <h2 className="text-xl lg:text-[25px] font-semibold text-black">
          Personal Details
        </h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </div>
    );
  }

  const personalData = [
    { label: "Full Name", value: `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || "N/A" },
    { label: "Preferred Name", value: employee.preferredName || "N/A" },
    { label: "Email", value: employee.email },
    { label: "Personal Email", value: employee.personalEmail || "N/A" },
    { label: "Phone Number", value: employee.phone || "N/A" },
    { label: "Phone Number (2)", value: employee.phone2 || "N/A" },
    { label: "Sex", value: employee.sex || "N/A" },
    { label: "Date of Birth", value: formatDate(employee.dateOfBirth) },
    { label: "Marital Status", value: employee.maritalStatus || "N/A" },
    { label: "Pronoun", value: employee.pronoun || "N/A" },
    { label: "Permanent Address", value: employee.permanentAddress || "N/A" },
    { label: "Current Address", value: employee.currentAddress || "N/A" },
    { label: "Hire Date", value: formatDate(employee.startDate || employee.hireDate) },
    { label: "Status", value: employee.status || "N/A" },
    { label: "Department", value: employee.departmentName || "N/A" },
    { label: "Position", value: employee.positionTitle || employee.positionName || "N/A" },
    { label: "Job Level", value: employee.jobLevel || employee.jobLevelName || "N/A" },
    { label: "Employment Type", value: employee.employeeType || employee.employmentTypeName || "N/A" },
    { label: "Time Type", value: employee.timeType || employee.timeTypeName || "N/A" },
  ];

  return (
    <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
      <h2 className="text-xl lg:text-[25px] font-semibold text-black">
        Personal Details
      </h2>

      <div className="flex flex-col py-2.5 gap-2.5">
        {personalData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row py-1.5 px-2.5 gap-2 lg:gap-[45px]"
          >
            <div className="w-full lg:w-[240px] text-black text-base lg:text-[17px] font-medium flex-shrink-0">
              {item.label}
            </div>
            <div className="text-gray-600 text-base lg:text-[17px] font-normal break-words">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleEdit}
        className="w-full lg:w-[168px] px-0 py-3 lg:py-[15px] rounded-[25px] bg-sky-200 text-lg lg:text-xl font-medium text-black hover:bg-sky-300 transition-colors"
      >
        EDIT
      </button>
    </div>
  );
}
