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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>Supporting Documents (Optional)</Label>
      <p className="text-xs text-muted-foreground">
        Upload medical certificate or other relevant documents
      </p>
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
