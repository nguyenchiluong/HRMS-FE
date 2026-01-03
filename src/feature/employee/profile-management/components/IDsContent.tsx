import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentEmployee } from "../hooks/useCurrentEmployee";

interface InfoRow {
  label: string;
  value: string;
  hasVisibilityToggle?: boolean;
}

function InfoRowComponent({ label, value, hasVisibilityToggle }: InfoRow) {
  const [isVisible, setIsVisible] = useState(false);

  const maskValue = (val: string) => {
    return "•".repeat(val.length);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-[45px] px-2.5 py-1.5">
      <div className="w-full sm:w-[240px] text-[17px] font-medium flex-shrink-0">
        {label}
      </div>
      <div className="flex items-center gap-3 text-hrms-text-secondary text-[17px]">
        <span className="font-mono">
          {hasVisibilityToggle && !isVisible ? maskValue(value) : value}
        </span>
        {hasVisibilityToggle && (
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="text-hrms-text-muted hover:text-hrms-primary transition-colors"
            aria-label={isVisible ? "Hide value" : "Show value"}
          >
            {isVisible ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IDsContent() {
  const editPageUrl = "/employee/profile/ids/edit";
  const navigate = useNavigate();
  const { data: employee, isLoading, isError, error } = useCurrentEmployee();

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
      <div className="bg-white rounded-[25px] p-6 lg:p-[45px] flex flex-col gap-2.5">
        <h2 className="text-[25px] font-semibold mb-2.5">Your IDs</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[25px] p-6 lg:p-[45px] flex flex-col gap-2.5">
        <h2 className="text-[25px] font-semibold mb-2.5">Your IDs</h2>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Error loading employee data</p>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-[25px] p-6 lg:p-[45px] flex flex-col gap-2.5">
        <h2 className="text-[25px] font-semibold mb-2.5">Your IDs</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </div>
    );
  }

  const basicInfo: InfoRow[] = [
    { 
      label: "Legal Full Name", 
      value: `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || "N/A" 
    },
    { 
      label: "Nationality", 
      value: employee.nationalIdCountry || "N/A" 
    },
  ];

  const nationalID: InfoRow[] = [
    { 
      label: "Identification #", 
      value: employee.nationalIdNumber || "N/A", 
      hasVisibilityToggle: !!employee.nationalIdNumber 
    },
    { 
      label: "Issued Date", 
      value: formatDate(employee.nationalIdIssuedDate) 
    },
    { 
      label: "Expiration Date", 
      value: formatDate(employee.nationalIdExpirationDate) 
    },
    {
      label: "Issued By",
      value: employee.nationalIdIssuedBy || "N/A",
    },
  ];

  const socialInsurance: InfoRow[] = [
    { 
      label: "Identification #", 
      value: employee.socialInsuranceNumber || "N/A",
      hasVisibilityToggle: !!employee.socialInsuranceNumber 
    },
  ];

  const taxID: InfoRow[] = [
    { 
      label: "Identification #", 
      value: employee.taxId || "N/A",
      hasVisibilityToggle: !!employee.taxId 
    },
  ];

  return (
    <div className="bg-white rounded-[25px] p-6 lg:p-[45px] flex flex-col gap-2.5">
      <h2 className="text-[25px] font-semibold mb-2.5">Your IDs</h2>

      <div className="flex flex-col gap-2.5 pb-[30px]">
        {basicInfo.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">National ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {nationalID.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">Social Insurance Number ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {socialInsurance.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">Tax ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {taxID.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <button className="w-[168px] h-[60px] bg-hrms-bg-light rounded-[25px] text-black text-xl font-medium hover:bg-hrms-bg-light/80 transition-colors"
        onClick={() => navigate(editPageUrl)}
      >
        EDIT
      </button>
    </div>
  );
}
