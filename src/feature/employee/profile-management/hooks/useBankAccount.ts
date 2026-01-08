/**
 * Bank Account React Query Hooks
 * 
 * Custom hooks for managing bank account data with React Query
 * Each employee has a single bank account
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMyBankAccount,
  createMyBankAccount,
  updateMyBankAccount,
  deleteMyBankAccount,
} from '../api';
import { CreateBankAccountDto, UpdateBankAccountDto } from '../types';

// Query keys for cache management
export const bankAccountKeys = {
  all: ['bankAccount'] as const,
  detail: () => [...bankAccountKeys.all, 'me'] as const,
};

/**
 * Hook to fetch the bank account for the current user (single account)
 */
export const useMyBankAccount = () => {
  return useQuery({
    queryKey: bankAccountKeys.detail(),
    queryFn: getMyBankAccount,
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
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.detail() });
      toast.success('Bank account created successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create bank account';
      toast.error(message);
    },
  });
};

/**
 * Hook to update the bank account
 */
export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: UpdateBankAccountDto;
    }) => updateMyBankAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.detail() });
      toast.success('Bank account updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update bank account';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete the bank account
 */
export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMyBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.detail() });
      toast.success('Bank account deleted successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete bank account';
      toast.error(message);
    },
  });
};
