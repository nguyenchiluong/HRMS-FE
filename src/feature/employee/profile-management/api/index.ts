/**
 * Profile Management API
 * 
 * Handles employee profile-related API calls
 */

import { dotnetApi } from '@/api';
import { 
  EmployeeDto, 
  UpdateProfileDto, 
  EducationRecordDto, 
  CreateEducationDto, 
  UpdateEducationDto,
  BankAccountRecordDto,
  CreateBankAccountDto,
  UpdateBankAccountDto
} from '../types';

/**
 * Gets the current authenticated employee's information from JWT token
 * @returns Promise with employee data
 */
export const getCurrentEmployee = async (): Promise<EmployeeDto> => {
  const response = await dotnetApi.get<EmployeeDto>('/api/employees/me');
  return response.data;
};

/**
 * Updates the current employee's personal information
 * Only the fields provided will be updated
 * @param data Partial employee data to update
 * @returns Promise with updated employee data
 */
export const updateCurrentEmployee = async (
  data: UpdateProfileDto
): Promise<EmployeeDto> => {
  const response = await dotnetApi.put<EmployeeDto>('/api/employees/me', data);
  return response.data;
};

// Education API

/**
 * Gets all education records for the authenticated user
 * @returns Promise with array of education records
 */
export const getMyEducations = async (): Promise<EducationRecordDto[]> => {
  const response = await dotnetApi.get<EducationRecordDto[]>('/api/education/me');
  return response.data;
};

/**
 * Gets a specific education record by ID
 * @param id The education record ID
 * @returns Promise with education record
 */
export const getMyEducation = async (id: number): Promise<EducationRecordDto> => {
  const response = await dotnetApi.get<EducationRecordDto>(`/api/education/me/${id}`);
  return response.data;
};

/**
 * Creates a new education record
 * @param data Education data to create
 * @returns Promise with created education record
 */
export const createMyEducation = async (
  data: CreateEducationDto
): Promise<EducationRecordDto> => {
  const response = await dotnetApi.post<EducationRecordDto>('/api/education/me', data);
  return response.data;
};

/**
 * Updates an existing education record
 * @param id The education record ID
 * @param data Education data to update
 * @returns Promise with updated education record
 */
export const updateMyEducation = async (
  id: number,
  data: UpdateEducationDto
): Promise<EducationRecordDto> => {
  const response = await dotnetApi.put<EducationRecordDto>(`/api/education/me/${id}`, data);
  return response.data;
};

/**
 * Deletes an education record
 * @param id The education record ID
 * @returns Promise<void>
 */
export const deleteMyEducation = async (id: number): Promise<void> => {
  await dotnetApi.delete(`/api/education/me/${id}`);
};

// Bank Account API

/**
 * Gets all bank accounts for the authenticated user
 * @returns Promise with array of bank account records
 */
export const getMyBankAccounts = async (): Promise<BankAccountRecordDto[]> => {
  const response = await dotnetApi.get<BankAccountRecordDto[]>('/api/bankaccount/me');
  return response.data;
};

/**
 * Gets a specific bank account by account number and bank name
 * @param accountNumber The bank account number
 * @param bankName The bank name
 * @returns Promise with bank account record
 */
export const getMyBankAccount = async (
  accountNumber: string,
  bankName: string
): Promise<BankAccountRecordDto> => {
  const response = await dotnetApi.get<BankAccountRecordDto>(
    `/api/bankaccount/me/${encodeURIComponent(accountNumber)}/${encodeURIComponent(bankName)}`
  );
  return response.data;
};

/**
 * Creates a new bank account
 * @param data Bank account data to create
 * @returns Promise with created bank account record
 */
export const createMyBankAccount = async (
  data: CreateBankAccountDto
): Promise<BankAccountRecordDto> => {
  const response = await dotnetApi.post<BankAccountRecordDto>('/api/bankaccount/me', data);
  return response.data;
};

/**
 * Updates an existing bank account
 * Note: Changing accountNumber or bankName will delete the old record and create a new one
 * @param accountNumber The current account number
 * @param bankName The current bank name
 * @param data Bank account data to update
 * @returns Promise with updated bank account record
 */
export const updateMyBankAccount = async (
  accountNumber: string,
  bankName: string,
  data: UpdateBankAccountDto
): Promise<BankAccountRecordDto> => {
  const response = await dotnetApi.put<BankAccountRecordDto>(
    `/api/bankaccount/me/${encodeURIComponent(accountNumber)}/${encodeURIComponent(bankName)}`,
    data
  );
  return response.data;
};

/**
 * Deletes a bank account
 * @param accountNumber The account number to delete
 * @param bankName The bank name to delete
 * @returns Promise<void>
 */
export const deleteMyBankAccount = async (
  accountNumber: string,
  bankName: string
): Promise<void> => {
  await dotnetApi.delete(
    `/api/bankaccount/me/${encodeURIComponent(accountNumber)}/${encodeURIComponent(bankName)}`
  );
};
