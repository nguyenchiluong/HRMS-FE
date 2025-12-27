export interface JobDetails {
  position: string;
  jobLevel: string;
  department: string;
  employeeType: string;
  timeType: string;
  onboardDate: string;
}

// Response from getOnboardingInfo endpoint (matches EmployeeDto from backend)
export interface OnboardingInfo {
  id: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  preferredName: string | null;
  email: string;
  personalEmail: string | null;
  phone: string | null;
  phone2: string | null;
  sex: string | null;
  dateOfBirth: string | null;
  maritalStatus: string | null;
  pronoun: string | null;
  permanentAddress: string | null;
  currentAddress: string | null;
  nationalIdCountry: string | null;
  nationalIdNumber: string | null;
  nationalIdIssuedDate: string | null;
  nationalIdExpirationDate: string | null;
  nationalIdIssuedBy: string | null;
  socialInsuranceNumber: string | null;
  taxId: string | null;
  startDate: string | null;
  positionTitle: string | null;
  departmentName: string | null;
  jobLevel: string | null;
  employeeType: string | null;
  timeType: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Education entry for the API payload
export interface EducationEntry {
  degree: string;
  fieldOfStudy: string;
  institution: string;
}

// Bank account for the API payload
export interface BankAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

// API payload for onboarding
export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  personalEmail: string;
  phone: string;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  permanentAddress: string;
  currentAddress: string;
  identificationNumber: string;
  socialInsuranceNumber: string;
  taxId: string;
  educations: EducationEntry[];
  bankAccount: BankAccount;
}

export interface OnboardingFormValues {
  // Personal Details
  firstName: string;
  lastName: string;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  personalEmail: string;
  permanentAddress: string;
  currentAddress: string;
  phone: string;

  // Identification
  identificationNumber: string;
  socialInsuranceNumber: string;
  taxId: string;

  // Financial
  bankName: string;
  accountNumber: string;
  accountName: string;

  // Education (optional, simplified)
  educations: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
  }[];

  // Attachments
  attachments: File[];
}

// Transform form values to API payload
export const transformFormToPayload = (
  values: OnboardingFormValues,
): OnboardingPayload => {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    personalEmail: values.personalEmail,
    phone: values.phone,
    sex: values.sex,
    dateOfBirth: values.dateOfBirth,
    maritalStatus: values.maritalStatus,
    permanentAddress: values.permanentAddress,
    currentAddress: values.currentAddress,
    identificationNumber: values.identificationNumber,
    socialInsuranceNumber: values.socialInsuranceNumber,
    taxId: values.taxId,
    educations: values.educations
      .filter((edu) => edu.degree && edu.institution)
      .map((edu) => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        institution: edu.institution,
      })),
    bankAccount: {
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      accountName: values.accountName,
    },
  };
};
