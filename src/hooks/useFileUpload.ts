/**
 * React Query hooks for file uploads to S3
 * 
 * This is a shared hook that can be used across the entire application
 */

import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { uploadFileToS3 } from '@/api/storage';

/**
 * Hook to upload a single file to S3
 * Returns a mutation that can be used to upload a file
 * 
 * @example
 * const uploadFile = useUploadFile();
 * const url = await uploadFile.mutateAsync(file);
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return await uploadFileToS3(file);
    },
    onError: (error) => {
      console.error('File upload failed:', error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to upload file. Please try again.');
      } else {
        toast.error('Failed to upload file. Please try again.');
      }
    },
  });
};

/**
 * Hook to upload multiple files to S3 in parallel
 * Returns an array of CloudFront URLs
 * 
 * @example
 * const uploadFiles = useUploadFiles();
 * const urls = await uploadFiles.mutateAsync([file1, file2]);
 */
export const useUploadFiles = () => {
  const uploadFile = useUploadFile();

  return useMutation({
    mutationFn: async (files: File[]): Promise<string[]> => {
      // Upload all files in parallel
      const uploadPromises = files.map((file) => uploadFile.mutateAsync(file));
      return await Promise.all(uploadPromises);
    },
    onError: (error) => {
      console.error('File uploads failed:', error);
      toast.error('Failed to upload some files. Please try again.');
    },
  });
};

