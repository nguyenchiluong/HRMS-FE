export interface JobDetails {
  position: string;
  jobLevel: string;
  department: string;
  employeeType: string;
  timeType: string;
  onboardDate: string;
}

export interface OnboardingFormValues {
  // Personal Details
  firstName: string;
  lastName: string;
  fullName: string;
  sex: string;
  dob: string;
  maritalStatus: string;
  pronoun: string;
  personalEmail: string;
  permanentAddress: string;
  currentAddress: string;
  phone1: string;
  phone2: string;
  preferredName: string;

  // Education
  highestDegree: string;
  educationCountry: string;
  institution: string;
  startYear: string;
  endYear: string;
  averageGrade: string;

  // National ID
  nationalIdCountry: string;
  identificationNumber: string;
  issuedDate: string;
  expirationDate: string;
  issuedBy: string;

  // Social Insurance
  socialInsuranceId: string;

  // Tax ID
  taxId: string;

  // Financial
  bankName: string;
  accountNumber: string;
  accountName: string;

  // Other
  comments: string;
  attachments: File[];
}
