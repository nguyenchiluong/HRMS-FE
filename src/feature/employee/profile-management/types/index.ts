/**
 * Profile Management Types
 */

export interface NationalIdDto {
  country?: string | null;
  number?: string | null;
  issuedDate?: string | null;
  expirationDate?: string | null;
  issuedBy?: string | null;
}

export interface EmployeeDto {
  id: number;
  fullName: string;
  firstName?: string | null;
  lastName?: string | null;
  preferredName?: string | null;
  email: string;
  personalEmail?: string | null;
  phone?: string | null;
  phone2?: string | null;
  sex?: string | null;
  dateOfBirth?: string | null;
  maritalStatus?: string | null;
  pronoun?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  nationalIdCountry?: string | null;
  nationalIdNumber?: string | null;
  nationalIdIssuedDate?: string | null;
  nationalIdExpirationDate?: string | null;
  nationalIdIssuedBy?: string | null;
  socialInsuranceNumber?: string | null;
  taxId?: string | null;
  startDate?: string | null;
  positionId?: number | null;
  departmentId?: number | null;
  jobLevelId?: number | null;
  employmentTypeId?: number | null;
  timeTypeId?: number | null;
  managerId?: number | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateProfileDto {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  preferredName?: string | null;
  sex?: string | null;
  dateOfBirth?: string | null;
  maritalStatus?: string | null;
  pronoun?: string | null;
  personalEmail?: string | null;
  phone?: string | null;
  phone2?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  nationalId?: NationalIdDto | null;
  socialInsuranceNumber?: string | null;
  taxId?: string | null;
}

export interface EmployeeProfileResponse {
  data: EmployeeDto;
  message?: string;
}

// Education Types
export interface EducationRecordDto {
  id: number;
  employeeId: number;
  degree: string;
  fieldOfStudy?: string | null;
  gpa?: number | null;
  country?: string | null;
}

export interface CreateEducationDto {
  degree: string;
  fieldOfStudy?: string | null;
  gpa?: number | null;
  country?: string | null;
}

export interface UpdateEducationDto {
  degree?: string | null;
  fieldOfStudy?: string | null;
  gpa?: number | null;
  country?: string | null;
}

// Bank Account Types
export interface BankAccountRecordDto {
  accountNumber: string;
  bankName: string;
  accountName?: string | null;
  employeeId: number;
}

export interface CreateBankAccountDto {
  accountNumber: string;
  bankName: string;
  accountName?: string | null;
}

export interface UpdateBankAccountDto {
  accountNumber?: string | null;
  bankName?: string | null;
  accountName?: string | null;
}
