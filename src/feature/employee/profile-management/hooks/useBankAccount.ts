/**
 * Bank Account React Query Hooks
 * 
 * Custom hooks for managing bank account data with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMyBankAccounts,
  getMyBankAccount,
  createMyBankAccount,
  updateMyBankAccount,
  deleteMyBankAccount,
} from '../api';
import { CreateBankAccountDto, UpdateBankAccountDto } from '../types';

// Query keys for cache management
export const bankAccountKeys = {
  all: ['bankAccounts'] as const,
  lists: () => [...bankAccountKeys.all, 'list'] as const,
  list: () => [...bankAccountKeys.lists()] as const,
  details: () => [...bankAccountKeys.all, 'detail'] as const,
  detail: (accountNumber: string, bankName: string) => 
    [...bankAccountKeys.details(), accountNumber, bankName] as const,
};

/**
 * Hook to fetch all bank accounts for the current user
 */
export const useMyBankAccounts = () => {
  return useQuery({
    queryKey: bankAccountKeys.list(),
    queryFn: getMyBankAccounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a specific bank account
 */
export const useMyBankAccount = (accountNumber: string, bankName: string) => {
  return useQuery({
    queryKey: bankAccountKeys.detail(accountNumber, bankName),
    queryFn: () => getMyBankAccount(accountNumber, bankName),
    enabled: !!accountNumber && !!bankName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new bank account
 */
export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankAccountDto) => createMyBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.list() });
      toast.success('Bank account added successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add bank account';
      toast.error(message);
    },
  });
};

/**
 * Hook to update an existing bank account
 */
export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      accountNumber, 
      bankName, 
      data 
    }: { 
      accountNumber: string; 
      bankName: string; 
      data: UpdateBankAccountDto;
    }) => updateMyBankAccount(accountNumber, bankName, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.list() });
      queryClient.invalidateQueries({ 
        queryKey: bankAccountKeys.detail(variables.accountNumber, variables.bankName) 
      });
      toast.success('Bank account updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update bank account';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete a bank account
 */
export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      accountNumber, 
      bankName 
    }: { 
      accountNumber: string; 
      bankName: string;
    }) => deleteMyBankAccount(accountNumber, bankName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.list() });
      toast.success('Bank account deleted successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete bank account';
      toast.error(message);
    },
  });
};
