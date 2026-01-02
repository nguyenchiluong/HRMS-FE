/**
 * Storage API utilities for file uploads to S3
 * Uses Spring Boot backend for presigned URLs
 * 
 * This is a shared utility that can be used across the entire application
 */

import springApi from './spring';

const STORAGE_ENDPOINT = '/storage';
const CLOUDFRONT_URL = 'https://d30yuvccb40k7f.cloudfront.net';

/**
 * Response from presigned URL endpoint
 */
interface PresignedUrlResponse {
  url: string;
  key: string;
}

/**
 * Get presigned URL for file upload
 */
export const getPresignedUrl = async (
  fileName: string,
  contentType: string,
): Promise<PresignedUrlResponse> => {
  const response = await springApi.get<PresignedUrlResponse>(
    `${STORAGE_ENDPOINT}/presigned-url`,
    {
      params: {
        fileName,
        contentType,
      },
    },
  );
  return response.data;
};

/**
 * Upload file to S3 using presigned URL
 * Returns the CloudFront URL of the uploaded file
 */
export const uploadFileToS3 = async (file: File): Promise<string> => {
  // 1. Get presigned URL with file name and content type
  const { url: presignedUrl, key } = await getPresignedUrl(file.name, file.type);
  
  // 2. Upload file to S3 using fetch (to avoid Axios interceptor issues)
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  
  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`);
  }
  
  // 3. Construct CloudFront URL from the key returned by the API
  return `${CLOUDFRONT_URL}/${key}`;
};

