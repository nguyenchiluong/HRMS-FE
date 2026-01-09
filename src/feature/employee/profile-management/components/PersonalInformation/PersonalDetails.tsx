import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { data: employee, isLoading, isError, error } = useCurrentEmployee();

  const handleEdit = () => {
    navigate('/employee/profile/personal-info/edit');
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
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-2xl font-semibold text-gray-900">
          Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Personal Details
        </h2>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
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
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </Card>
    );
  }

  const personalData = [
    {
      label: 'Full Name',
      value:
        `${employee.fullName}`.trim() ||
        'N/A',
    },
    { label: 'First Name', value: employee.firstName || 'N/A' },
    { label: 'Last Name', value: employee.lastName || 'N/A' },
    { label: 'Preferred Name', value: employee.preferredName || 'N/A' },
    { label: 'Email', value: employee.email },
    { label: 'Personal Email', value: employee.personalEmail || 'N/A' },
    { label: 'Phone Number', value: employee.phone || 'N/A' },
    { label: 'Phone Number (2)', value: employee.phone2 || 'N/A' },
    { label: 'Sex', value: employee.sex || 'N/A' },
    { label: 'Date of Birth', value: formatDate(employee.dateOfBirth) },
    { label: 'Marital Status', value: employee.maritalStatus || 'N/A' },
    { label: 'Pronoun', value: employee.pronoun || 'N/A' },
    { label: 'Permanent Address', value: employee.permanentAddress || 'N/A' },
    { label: 'Current Address', value: employee.currentAddress || 'N/A' },
    {
      label: 'Hire Date',
      value: formatDate(employee.startDate),
    },
    { label: 'Status', value: employee.status || 'N/A' },
  ];

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">Personal Details</h2>
        <Button onClick={handleEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {personalData.map((item, index) => (
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
    </Card>
  );
}
