import { useField, useFormikContext } from 'formik';
import React, { useRef } from 'react';

export const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFieldValue } = useFormikContext();
  const [field] = useField('attachments');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      // Convert FileList to Array
      setFieldValue('attachments', Array.from(event.currentTarget.files));
    }
  };

  const files = field.value as File[];

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-center gap-1">
        <h3 className="text-base font-medium text-slate-900">Attachments</h3>
        <span className="text-red-500">*</span>
      </div>

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-100 p-10 transition-colors hover:border-primary/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="pointer-events-none rounded-full bg-blue-200 px-8 py-3 font-medium text-slate-800 transition-colors hover:bg-blue-300"
        >
          Select files
        </button>

        {files && files.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p>{files.length} file(s) selected</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs italic text-slate-500">
        <span className="font-medium not-italic text-primary">Note:</span>
        <ul className="ml-5 mt-1 list-disc space-y-1">
          <li>Identification card picture</li>
          <li>Your education degree (if yes)</li>
        </ul>
      </div>
    </div>
  );
};
