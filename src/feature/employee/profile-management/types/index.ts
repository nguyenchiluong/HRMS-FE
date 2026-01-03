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
  fullName?: string;
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
  positionTitle?: string | null;
  departmentName?: string | null;
  jobLevel?: string | null;
  employeeType?: string | null;
  timeType?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  // Legacy fields for backward compatibility
  hireDate?: string;
  departmentId?: number | null;
  positionId?: number | null;
  positionName?: string | null;
  jobLevelId?: number | null;
  jobLevelName?: string | null;
  employmentTypeId?: number | null;
  employmentTypeName?: string | null;
  timeTypeId?: number | null;
  timeTypeName?: string | null;
}

export interface UpdateProfileDto {
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
