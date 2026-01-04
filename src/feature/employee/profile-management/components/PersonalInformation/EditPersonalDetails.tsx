import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updateCurrentEmployee } from '../../api';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';
import { UpdateProfileDto } from '../../types';

interface PersonalDetailsForm {
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  pronoun: string;
  personalEmail: string;
  permanentAddress: string;
  currentAddress: string;
  phoneNumber1: string;
  phoneNumber2: string;
  preferredName: string;
  firstName: string;
  lastName: string;
}

export default function EditPersonalDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: employee, isLoading: isLoadingEmployee } = useCurrentEmployee();

  const [formData, setFormData] = useState<PersonalDetailsForm>({
    sex: '',
    dateOfBirth: '',
    maritalStatus: '',
    pronoun: '',
    personalEmail: '',
    permanentAddress: '',
    currentAddress: '',
    phoneNumber1: '',
    phoneNumber2: '',
    preferredName: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalDetailsForm, string>>
  >({});

  // Load employee data into form
  useEffect(() => {
    if (employee) {
      setFormData({
        sex: employee.sex || '',
        dateOfBirth: employee.dateOfBirth || '',
        maritalStatus: employee.maritalStatus || '',
        pronoun: employee.pronoun || '',
        personalEmail: employee.personalEmail || '',
        permanentAddress: employee.permanentAddress || '',
        currentAddress: employee.currentAddress || '',
        phoneNumber1: employee.phone || '',
        phoneNumber2: employee.phone2 || '',
        preferredName: employee.preferredName || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
      });
    }
  }, [employee]);

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => updateCurrentEmployee(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentEmployee'], data);
      toast.success('Profile updated successfully!');
      navigate('/employee/profile/personal-info');
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update profile';
      if (error && typeof error === 'object') {
        if (
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response
        ) {
          const data = error.response.data as { message?: string };
          errorMessage = data.message || errorMessage;
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
      console.error('Update error:', error);
    },
  });

  const handleFieldChange = (
    field: keyof PersonalDetailsForm,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalDetailsForm, string>> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber1 || formData.phoneNumber1.trim() === '') {
      newErrors.phoneNumber1 = 'Phone number is required';
    }

    if (!formData.sex || formData.sex.trim() === '') {
      newErrors.sex = 'Sex is required';
    }

    if (!formData.dateOfBirth || formData.dateOfBirth.trim() === '') {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.maritalStatus || formData.maritalStatus.trim() === '') {
      newErrors.maritalStatus = 'Marital status is required';
    }

    if (!formData.permanentAddress || formData.permanentAddress.trim() === '') {
      newErrors.permanentAddress = 'Permanent address is required';
    }

    if (!formData.currentAddress || formData.currentAddress.trim() === '') {
      newErrors.currentAddress = 'Current address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateChanges = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    const updateData: UpdateProfileDto = {
      // firstName and lastName are read-only, not included in update
      preferredName: formData.preferredName || undefined,
      sex: formData.sex || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      maritalStatus: formData.maritalStatus || undefined,
      pronoun: formData.pronoun || undefined,
      personalEmail: formData.personalEmail || undefined,
      phone: formData.phoneNumber1 || undefined,
      phone2: formData.phoneNumber2 || undefined,
      permanentAddress: formData.permanentAddress || undefined,
      currentAddress: formData.currentAddress || undefined,
    };

    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    navigate('/employee/profile/personal-info');
  };

  if (isLoadingEmployee) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className="flex h-full w-full flex-col overflow-hidden p-6">
        <h2 className="mb-6 shrink-0 text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">No employee data available</p>
        </div>
      </Card>
    );
  }

  const formFields = [
    {
      key: 'firstName' as keyof PersonalDetailsForm,
      label: 'First Name',
      type: 'text',
      readOnly: true,
    },
    {
      key: 'lastName' as keyof PersonalDetailsForm,
      label: 'Last Name',
      type: 'text',
      readOnly: true,
    },
    {
      key: 'preferredName' as keyof PersonalDetailsForm,
      label: 'Preferred Name',
      type: 'text',
    },
    {
      key: 'personalEmail' as keyof PersonalDetailsForm,
      label: 'Personal Email',
      type: 'text',
    },
    {
      key: 'phoneNumber1' as keyof PersonalDetailsForm,
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      key: 'phoneNumber2' as keyof PersonalDetailsForm,
      label: 'Phone Number (2)',
      type: 'text',
    },
    {
      key: 'sex' as keyof PersonalDetailsForm,
      label: 'Sex',
      type: 'select',
      options: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: true,
    },
    {
      key: 'dateOfBirth' as keyof PersonalDetailsForm,
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      key: 'maritalStatus' as keyof PersonalDetailsForm,
      label: 'Marital Status',
      type: 'select',
      options: ['Single', 'Married', 'Divorced', 'Widowed'],
      required: true,
    },
    {
      key: 'pronoun' as keyof PersonalDetailsForm,
      label: 'Pronoun',
      type: 'select',
      options: ['he/him', 'she/her', 'they/them', 'other'],
    },
    {
      key: 'permanentAddress' as keyof PersonalDetailsForm,
      label: 'Permanent Address',
      type: 'text',
      required: true,
    },
    {
      key: 'currentAddress' as keyof PersonalDetailsForm,
      label: 'Current Address',
      type: 'text',
      required: true,
    },
  ];

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">
          Edit Personal Details
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleCancel} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleUpdateChanges}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Changes'
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {formFields.map((field) => (
          <div
            key={field.key}
            className="font-regular flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start"
          >
            <Label
              htmlFor={field.key}
              className="font-regular w-full text-sm text-gray-700 md:w-56 md:flex-shrink-0"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            <div className="flex-1 space-y-1">
              {field.type === 'select' && field.options ? (
                <Select
                  value={formData[field.key]}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger
                    id={field.key}
                    className={cn(errors[field.key] && 'border-red-500')}
                  >
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'date' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData[field.key] && 'text-muted-foreground',
                        errors[field.key] && 'border-red-500',
                      )}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {formData[field.key]
                          ? format(new Date(formData[field.key]), 'PPP')
                          : `Select ${field.label.toLowerCase()}`}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData[field.key]
                          ? new Date(formData[field.key])
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          handleFieldChange(field.key, formattedDate);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  id={field.key}
                  type="text"
                  value={formData[field.key]}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  disabled={field.readOnly}
                  className={cn(
                    errors[field.key] && 'border-red-500',
                    field.readOnly && 'cursor-not-allowed bg-gray-50',
                  )}
                />
              )}
              {errors[field.key] && (
                <p className="text-sm text-red-500">{errors[field.key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
