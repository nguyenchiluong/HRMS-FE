import { useField, useFormikContext } from 'formik';
import { Upload, X } from 'lucide-react';
import React, { useRef } from 'react';

export const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFieldValue } = useFormikContext();
  const [field] = useField('attachments');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const newFiles = Array.from(event.currentTarget.files);
      const existingFiles = field.value as File[];
      setFieldValue('attachments', [...existingFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const files = field.value as File[];
    setFieldValue(
      'attachments',
      files.filter((_, i) => i !== index),
    );
  };

  const files = field.value as File[];

  return (
    <div>
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 transition-colors hover:border-slate-300 hover:bg-slate-100"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <Upload className="mb-2 h-6 w-6 text-slate-400" />
        <p className="text-sm font-medium text-slate-600">
          Click to upload files
        </p>
        <p className="mt-1 text-xs text-slate-400">
          ID card, degree certificates (PDF, JPG, PNG)
        </p>
      </div>

      {files && files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2"
            >
              <span className="truncate text-sm text-slate-700">
                {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="ml-2 text-slate-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
