import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import React from 'react';

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFilesChange,
}) => {
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds the maximum size of 10MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File "${file.name}" is not a supported type. Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Check total file count
      if (files.length + newFiles.length > MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} files allowed`);
      }

      // Validate each file
      newFiles.forEach((file) => {
        if (files.length + validFiles.length >= MAX_FILES) {
          errors.push(`Maximum ${MAX_FILES} files allowed`);
          return;
        }
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      // Show errors if any
      if (errors.length > 0) {
        alert(errors.join('\n'));
      }

      // Add valid files
      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>Supporting Documents (Optional)</Label>
      <p className="text-xs text-muted-foreground">
        Upload medical certificate or other relevant documents (Max 5 files, 10MB each. Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX)
      </p>
      {files.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {files.length} / {MAX_FILES} files selected
        </p>
      )}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-gray-400 hover:bg-gray-100"
        >
          <Upload className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Click to upload or drag and drop
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border bg-white px-3 py-2"
              >
                <span className="truncate text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
