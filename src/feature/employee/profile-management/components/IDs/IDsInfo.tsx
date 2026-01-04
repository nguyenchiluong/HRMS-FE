import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';

interface InfoRow {
  label: string;
  value: string;
  hasVisibilityToggle?: boolean;
}

function InfoRowComponent({ label, value, hasVisibilityToggle }: InfoRow) {
  const [isVisible, setIsVisible] = useState(false);

  const maskValue = (val: string) => {
    return '•'.repeat(val.length);
  };

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <div className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0">
        {label}
      </div>
      <div className="flex flex-1 items-center gap-2 break-words text-sm text-gray-900">
        <span className={hasVisibilityToggle ? 'font-mono' : ''}>
          {hasVisibilityToggle && !isVisible ? maskValue(value) : value}
        </span>
        {hasVisibilityToggle && (
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={isVisible ? 'Hide value' : 'Show value'}
            type="button"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IDsInfo() {
  const navigate = useNavigate();
  const { data: employee, isLoading, isError, error } = useCurrentEmployee();

  const handleEdit = () => {
    navigate('/employee/profile/ids/edit');
  };

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
        <h2 className="mb-6 text-xl font-medium text-gray-900">Your IDs</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex w-full flex-col p-6">
        <h2 className="mb-6 text-xl font-medium text-gray-900">Your IDs</h2>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading employee data</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className="flex w-full flex-col p-6">
        <h2 className="mb-6 text-xl font-medium text-gray-900">Your IDs</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </Card>
    );
  }

  const personalInfo: InfoRow[] = [
    {
      label: 'Legal Full Name',
      value:
        `${employee.fullName || ''}`.trim() ||
        'N/A',
    },
    {
      label: 'First Name',
      value: employee.firstName || 'N/A',
    },
    {
      label: 'Last Name',
      value: employee.lastName || 'N/A',
    },
    {
      label: 'Nationality',
      value: employee.nationalIdCountry || 'N/A',
    },
    {
      label: 'Social Insurance Number',
      value: employee.socialInsuranceNumber || 'N/A',
      hasVisibilityToggle:
        !!employee.socialInsuranceNumber &&
        employee.socialInsuranceNumber !== 'N/A',
    },
    {
      label: 'Tax ID Number',
      value: employee.taxId || 'N/A',
      hasVisibilityToggle: !!employee.taxId && employee.taxId !== 'N/A',
    },
  ];

  const nationalID: InfoRow[] = [
    {
      label: 'National ID Number',
      value: employee.nationalIdNumber || 'N/A',
      hasVisibilityToggle:
        !!employee.nationalIdNumber && employee.nationalIdNumber !== 'N/A',
    },
    {
      label: 'Issued Date',
      value: formatDate(employee.nationalIdIssuedDate),
    },
    {
      label: 'Expiration Date',
      value: formatDate(employee.nationalIdExpirationDate),
    },
    {
      label: 'Issued By',
      value: employee.nationalIdIssuedBy || 'N/A',
    },
  ];

  return (
    <Card className="flex w-full flex-col p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">Your IDs</h2>
        <Button onClick={handleEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          {personalInfo.map((info, index) => (
            <InfoRowComponent key={index} {...info} />
          ))}
        </div>

        {/* National ID Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">National ID</h3>
          {nationalID.map((info, index) => (
            <InfoRowComponent key={index} {...info} />
          ))}
        </div>
      </div>
    </Card>
  );
}
