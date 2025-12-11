import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployeeStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';

type Step = 'personal' | 'job' | 'financial' | 'education' | 'ids';

export default function InitialProfileSetup() {
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { getEmployeeById, updateEmployeeProfile } = useEmployeeStore();

  const employee = employeeId ? getEmployeeById(employeeId) : null;

  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState({
    personalInfo: {
      phone: '',
      address: '',
      city: '',
      country: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
    },
    jobDetails: {
      manager: '',
      jobLevel: '',
      employmentType: 'Full-time',
      reportingManager: '',
    },
    financialInfo: {
      bankName: '',
      accountNumber: '',
      taxId: '',
    },
    educationInfo: {
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
    },
    employeeIds: [
      {
        type: '',
        idNumber: '',
        issuedDate: '',
        expiryDate: '',
      },
    ],
  });

  const steps: { id: Step; label: string; title: string }[] = [
    { id: 'personal', label: 'Personal', title: 'Personal Information' },
    { id: 'job', label: 'Job', title: 'Job Details' },
    { id: 'financial', label: 'Financial', title: 'Financial Information' },
    { id: 'education', label: 'Education', title: 'Education' },
    { id: 'ids', label: 'IDs', title: 'Employee IDs' },
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (section: string, index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as Record<string, string>[]).map((item: Record<string, string>, i: number) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    if (employeeId) {
      updateEmployeeProfile(employeeId, {
        personalInfo: formData.personalInfo,
        jobDetails: formData.jobDetails,
        financialInfo: formData.financialInfo,
        educationInfo: formData.educationInfo,
        employeeIds: formData.employeeIds,
        profileSetupCompleted: true,
      });
      navigate('/employees');
    }
  };

  if (!employee) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <p>Employee not found</p>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <Input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <select
            className="w-full px-3 py-2 border rounded-md border-input"
            value={formData.personalInfo.gender}
            onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Marital Status</label>
          <select
            className="w-full px-3 py-2 border rounded-md border-input"
            value={formData.personalInfo.maritalStatus}
            onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            placeholder="Street address"
            value={formData.personalInfo.address}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input
            placeholder="City"
            value={formData.personalInfo.city}
            onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            placeholder="Country"
            value={formData.personalInfo.country}
            onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Reporting Manager</label>
          <Input
            placeholder="Manager name or ID"
            value={formData.jobDetails.reportingManager}
            onChange={(e) => handleInputChange('jobDetails', 'reportingManager', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Level</label>
          <select
            className="w-full px-3 py-2 border rounded-md border-input"
            value={formData.jobDetails.jobLevel}
            onChange={(e) => handleInputChange('jobDetails', 'jobLevel', e.target.value)}
          >
            <option value="">Select Job Level</option>
            <option value="Entry">Entry Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Employment Type</label>
          <select
            className="w-full px-3 py-2 border rounded-md border-input"
            value={formData.jobDetails.employmentType}
            onChange={(e) => handleInputChange('jobDetails', 'employmentType', e.target.value)}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Manager</label>
          <Input
            placeholder="Manager name"
            value={formData.jobDetails.manager}
            onChange={(e) => handleInputChange('jobDetails', 'manager', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Name</label>
          <Input
            placeholder="Bank name"
            value={formData.financialInfo.bankName}
            onChange={(e) => handleInputChange('financialInfo', 'bankName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Number</label>
          <Input
            placeholder="Account number"
            value={formData.financialInfo.accountNumber}
            onChange={(e) => handleInputChange('financialInfo', 'accountNumber', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tax ID</label>
          <Input
            placeholder="Tax ID / SSN"
            value={formData.financialInfo.taxId}
            onChange={(e) => handleInputChange('financialInfo', 'taxId', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderEducationInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">School/University</label>
          <Input
            placeholder="School or University name"
            value={formData.educationInfo.school}
            onChange={(e) => handleInputChange('educationInfo', 'school', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Degree</label>
          <select
            className="w-full px-3 py-2 border rounded-md border-input"
            value={formData.educationInfo.degree}
            onChange={(e) => handleInputChange('educationInfo', 'degree', e.target.value)}
          >
            <option value="">Select Degree</option>
            <option value="High School">High School</option>
            <option value="Associate">Associate</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Field of Study</label>
          <Input
            placeholder="e.g., Computer Science"
            value={formData.educationInfo.field}
            onChange={(e) => handleInputChange('educationInfo', 'field', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Graduation Date</label>
          <Input
            type="date"
            value={formData.educationInfo.graduationDate}
            onChange={(e) => handleInputChange('educationInfo', 'graduationDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderEmployeeIds = () => (
    <div className="space-y-4">
      {formData.employeeIds.map((id, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">ID #{index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Type</label>
              <select
                className="w-full px-3 py-2 border rounded-md border-input"
                value={id.type}
                onChange={(e) => handleArrayInputChange('employeeIds', index, 'type', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
                <option value="Driver License">Driver License</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Number</label>
              <Input
                placeholder="ID number"
                value={id.idNumber}
                onChange={(e) => handleArrayInputChange('employeeIds', index, 'idNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Issued Date</label>
              <Input
                type="date"
                value={id.issuedDate}
                onChange={(e) => handleArrayInputChange('employeeIds', index, 'issuedDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                type="date"
                value={id.expiryDate}
                onChange={(e) => handleArrayInputChange('employeeIds', index, 'expiryDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalInfo();
      case 'job':
        return renderJobDetails();
      case 'financial':
        return renderFinancialInfo();
      case 'education':
        return renderEducationInfo();
      case 'ids':
        return renderEmployeeIds();
      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Setup Initial Profile</h1>
          <p className="text-muted-foreground mt-2">
            Complete the profile for {employee.name}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === step.id
                ? 'bg-blue-500 text-white'
                : index < currentStepIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index < currentStepIndex && <Check className="w-4 h-4 mr-1 inline" />}
            {step.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData?.title}</CardTitle>
          <CardDescription>
            Step {currentStepIndex + 1} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
              >
                Previous
              </Button>
              {currentStepIndex === steps.length - 1 ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Complete Setup
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
