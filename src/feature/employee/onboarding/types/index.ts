export interface JobDetails {
  position: string;
  jobLevel: string;
  department: string;
  employeeType: string;
  timeType: string;
  onboardDate: string;
}

// National ID structure
export interface NationalId {
  country: string | null;
  number: string | null;
  issuedDate: string | null;
  expirationDate: string | null;
  issuedBy: string | null;
}

// Education entry from backend response
export interface EducationData {
  degree: string;
  fieldOfStudy: string | null;
  country: string | null;
  institution: string | null;
  startYear: number | null;
  endYear: number | null;
  gpa: number | null;
}

// Bank account data from backend response
export interface BankAccountData {
  bankName: string;
  accountNumber: string;
  accountName: string | null;
  swiftCode: string | null;
  branchCode: string | null;
}

// Response from getOnboardingInfo endpoint (OnboardingInfoDto from backend)
export interface OnboardingInfo {
  firstName: string;
  lastName: string;
  preferredName: string | null;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  pronoun: string | null;
  personalEmail: string;
  phone: string;
  phone2: string | null;
  permanentAddress: string;
  currentAddress: string;
  nationalId: NationalId | null;
  socialInsuranceNumber: string;
  taxId: string;
  education: EducationData[] | null;
  bankAccount: BankAccountData | null;
  comment: string | null;
}

// Education entry for the API payload
export interface EducationEntry {
  degree: string;
  fieldOfStudy: string;
  institution: string | null;
  startYear: number | null;
  endYear: number | null;
}

// Bank account for the API payload
export interface BankAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
  swiftCode?: string | null;
  branchCode?: string | null;
}

// API payload for onboarding
export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  preferredName?: string | null;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  pronoun?: string | null;
  personalEmail: string;
  phone: string;
  phone2?: string | null;
  permanentAddress: string;
  currentAddress: string;
  nationalId: NationalId | null;
  socialInsuranceNumber: string;
  taxId: string;
  education: EducationEntry[];
  bankAccount: BankAccount;
  comment?: string | null;
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
  swiftCode: string;
  branchCode: string;

  // Education (optional, simplified)
  educations: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startYear: string;
    endYear: string;
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
    nationalId: {
      country: null,
      number: values.identificationNumber || null,
      issuedDate: null,
      expirationDate: null,
      issuedBy: null,
    },
    socialInsuranceNumber: values.socialInsuranceNumber,
    taxId: values.taxId,
    education: values.educations
      .filter((edu) => edu.degree && edu.institution)
      .map((edu) => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        institution: edu.institution || null,
        startYear: edu.startYear ? parseInt(edu.startYear, 10) : null,
        endYear: edu.endYear ? parseInt(edu.endYear, 10) : null,
      })),
    bankAccount: {
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      accountName: values.accountName,
      swiftCode: values.swiftCode || null,
      branchCode: values.branchCode || null,
    },
  };
};
