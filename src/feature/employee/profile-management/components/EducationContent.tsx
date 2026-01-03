import { useState, useRef, useEffect } from "react";
import { BookOpen, X, File, Image, FileText, Loader2, Trash2, Edit } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import type { FormikProps } from "formik";
import * as Yup from "yup";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyEducations, useCreateEducation, useUpdateEducation, useDeleteEducation } from '../hooks/useEducation';
import { CreateEducationDto, UpdateEducationDto } from '../types';

interface EducationFormValues {
  country: string;
  degree: string;
  fieldOfStudy: string;
  averageGrade: string;
  comment: string;
  attachments: FileList | null;
}

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: "select" | "text";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

function FormField({ label, name, required, type = "text", options = [], placeholder }: FormFieldProps) {
  const [field, meta, helpers] = useField(name);

  if (type === "select") {
    return (
      <div className="flex flex-col gap-2.5 p-2.5">
        <Label className="text-[15px] font-medium">
          <span className="text-black">{label}</span>
          {required && <span className="text-red-600"> *</span>}
        </Label>
        <Select
          value={field.value}
          onValueChange={(value) => helpers.setValue(value)}
        >
          <SelectTrigger className="w-full px-5 py-2.5 border border-[#999] rounded-[5px] text-[15px] text-[#65686B]">
            <SelectValue placeholder={placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {meta.error && meta.touched && (
          <div className="text-destructive text-xs mt-1">{meta.error}</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 p-2.5">
      <Label className="text-[15px] font-medium">
        <span className="text-black">{label}</span>
        {required && <span className="text-red-600"> *</span>}
      </Label>
      <Field
        as={Input}
        name={name}
        placeholder={placeholder}
        className="w-full px-5 py-2.5 border border-[#999] rounded-[5px] text-[15px] text-[#65686B]"
      />
      <ErrorMessage name={name} component="div" className="text-destructive text-xs mt-1" />
    </div>
  );
}

const countryOptions = [
  { value: "Vietnam", label: "Vietnam" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "South Korea", label: "South Korea" },
  { value: "Singapore", label: "Singapore" },
];

const degreeOptions = [
  { value: "High School", label: "High School" },
  { value: "Associate", label: "Associate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "Doctorate", label: "Doctorate" },
];

const fieldOfStudyOptions = [
  { value: "Information Technology", label: "Information Technology" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Engineering", label: "Engineering" },
  { value: "Economics", label: "Economics" },
  { value: "Other", label: "Other" },
];


const validationSchema = Yup.object({
  country: Yup.string(),
  degree: Yup.string().required("Degree is required").max(200, "Degree must not exceed 200 characters"),
  fieldOfStudy: Yup.string().max(200, "Field of study must not exceed 200 characters"),
  averageGrade: Yup.number()
    .nullable()
    .min(0.0, "GPA must be at least 0.0")
    .max(4.0, "GPA must not exceed 4.0"),
  comment: Yup.string(),
});

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  initialValues: EducationFormValues;
  onSubmit: (values: EducationFormValues) => void;
  isLoading?: boolean;
}

function EducationModal({ isOpen, onClose, title, submitLabel, initialValues, onSubmit, isLoading = false }: EducationModalProps) {
  const fileUrlsRef = useRef<Map<File, string>>(new Map());

  useEffect(() => {
    return () => {
      fileUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      fileUrlsRef.current.clear();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full max-w-[487px] max-h-[90vh] overflow-y-auto p-5 flex flex-col gap-2.5">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-2.5">
          <h3 className="text-black text-xl font-medium">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-hrms-text-muted" />
          </button>
        </div>
        <p className="text-black text-xl font-normal">Kid Nguyen (Kiet Nguyen)</p>
        
        <hr className="border-t border-black/25 w-full" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            console.log("Formik onSubmit called with:", values);
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values, errors, touched, isSubmitting }: FormikProps<EducationFormValues>) => (
            <Form className="flex flex-col gap-1.5">
              {/* Form Fields */}
              <div className="py-2.5">
                <FormField label="Country" name="country" type="select" options={countryOptions} />
                <FormField label="Degree" name="degree" required type="select" options={degreeOptions} />
                <FormField label="Field of Study" name="fieldOfStudy" type="select" options={fieldOfStudyOptions} />
                <FormField label="Average Grade (GPA)" name="averageGrade" type="text" placeholder="3.65" />
              </div>

              {/* Attachments */}
              <div className="flex justify-between items-center px-2.5 pt-2.5">
                <h4 className="text-black text-xl font-medium">Attachments</h4>
              </div>
              
              <div className="h-[160px] bg-[#C4C4C4]/30 rounded-[20px] flex items-center justify-center relative border-2 border-dashed border-input mx-2.5">
                <input
                  type="file"
                  multiple
                  onChange={(event) => {
                    const newFiles = event.currentTarget.files;
                    if (newFiles && newFiles.length > 0) {
                      const dt = new DataTransfer();
                      if (values.attachments) {
                        Array.from(values.attachments).forEach((file) => dt.items.add(file));
                      }
                      Array.from(newFiles).forEach((file) => dt.items.add(file));
                      setFieldValue("attachments", dt.files);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="*/*"
                />
                <button
                  type="button"
                  className="px-[40px] py-3 bg-hrms-bg-light rounded-[30px] text-black text-lg font-normal hover:bg-[#adc4d4]"
                >
                  {values.attachments && values.attachments.length > 0 ? "Add more files" : "Select files"}
                </button>
              </div>

              {values.attachments && values.attachments.length > 0 && (
                <div className="mx-2.5 mt-2 space-y-2">
                  {Array.from(values.attachments).map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const fileSize = (file.size / 1024).toFixed(2);
                    const FileIcon = isImage ? Image : file.type.includes("pdf") ? FileText : File;
                    const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
                    
                    let imageUrl = "";
                    if (isImage) {
                      if (!fileUrlsRef.current.has(file)) {
                        const url = URL.createObjectURL(file);
                        fileUrlsRef.current.set(file, url);
                      }
                      imageUrl = fileUrlsRef.current.get(file) || "";
                    }
                    
                    return (
                      <div
                        key={fileKey}
                        className="flex items-center gap-3 p-2 bg-hrms-bg-light rounded-[10px] border border-input"
                      >
                        {isImage ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={imageUrl} alt={file.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                            <FileIcon className="w-5 h-5 text-hrms-text-muted" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-hrms-text-primary truncate">{file.name}</p>
                          <p className="text-xs text-hrms-text-secondary">
                            {Number(fileSize) > 1024
                              ? `${(Number(fileSize) / 1024).toFixed(2)} MB`
                              : `${fileSize} KB`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (isImage && fileUrlsRef.current.has(file)) {
                              const url = fileUrlsRef.current.get(file);
                              if (url) URL.revokeObjectURL(url);
                              fileUrlsRef.current.delete(file);
                            }
                            const dt = new DataTransfer();
                            Array.from(values.attachments || []).forEach((f, i) => {
                              if (i !== index) dt.items.add(f);
                            });
                            setFieldValue("attachments", dt.files.length > 0 ? dt.files : null);
                          }}
                          className="p-1 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4 text-hrms-text-muted hover:text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comment */}
              <div className="flex flex-col gap-2.5 px-2.5 pb-[20px] pt-2.5">
                <Label className="text-black text-[17px] font-normal">Your comment</Label>
                <Field
                  as={Textarea}
                  name="comment"
                  placeholder="Enter your comment..."
                  className="h-[100px] bg-[#C4C4C4]/30 rounded-[20px] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-hrms-primary"
                />
              </div>

              {/* Validation Errors Debug */}
              {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                <div className="mx-2.5 p-2 bg-red-50 rounded text-red-600 text-sm">
                  Please fill in all required fields
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-[30px] px-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-[12px] rounded-[25px] text-black text-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || isLoading}
                  onClick={async () => {
                    // Validate the form first
                    const validationErrors = await validationSchema.validate(values).catch((err) => err);
                    if (validationErrors?.errors) {
                      console.log("Validation failed:", validationErrors.errors);
                      return;
                    }
                    // If validation passes, call onSubmit directly
                    console.log("Submitting with values:", values);
                    onSubmit(values);
                  }}
                  className="flex-1 px-6 py-[12px] bg-hrms-primary rounded-[25px] text-white text-lg font-medium hover:bg-hrms-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitLabel}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function EducationContent() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);
  
  const { data: educations, isLoading, isError, error } = useMyEducations();
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();
  const deleteMutation = useDeleteEducation();

  const handleAddSubmit = (values: EducationFormValues) => {
    const data: CreateEducationDto = {
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy || null,
      gpa: values.averageGrade ? parseFloat(values.averageGrade) : null,
      country: values.country || null,
    };

    createMutation.mutate(data, {
      onSuccess: () => {
        setShowAddModal(false);
      },
    });
  };

  const handleEditSubmit = (values: EducationFormValues) => {
    if (!editingEducationId) return;

    const data: UpdateEducationDto = {
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy || null,
      gpa: values.averageGrade ? parseFloat(values.averageGrade) : null,
      country: values.country || null,
    };

    updateMutation.mutate(
      { id: editingEducationId, data },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setEditingEducationId(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    setEditingEducationId(id);
    setShowEditModal(true);
  };

  const getEditInitialValues = (): EducationFormValues => {
    const education = educations?.find(e => e.id === editingEducationId);
    return {
      country: education?.country || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      averageGrade: education?.gpa?.toString() || "",
      comment: "",
      attachments: null,
    };
  };

  const addInitialValues: EducationFormValues = {
    country: "",
    degree: "",
    fieldOfStudy: "",
    averageGrade: "",
    comment: "",
    attachments: null,
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[25px] shadow-md p-6 lg:p-10">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[25px] shadow-md p-6 lg:p-10">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Error loading education records</p>
          <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }



  return (
    <div className="flex-1">
      <div className="bg-white rounded-[25px] px-4 lg:px-[45px] py-4 lg:py-[30px] flex flex-col gap-[30px]">
        <h2 className="text-hrms-text-primary text-xl lg:text-[25px] font-semibold">Education</h2>
        
        {/* Education List */}
        <div className="flex flex-col gap-6">
          {educations && educations.length > 0 ? (
            educations.map((education) => (
              <div key={education.id} className="flex flex-col gap-0 pb-[20px] pt-2.5 border-b border-gray-200 last:border-b-0">
                {/* Education Entry Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start px-2.5 py-[5px] gap-2">
                  <h3 className="text-black text-base lg:text-[17px] font-medium max-w-[541px]">
                    {education.degree}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(education.id)}
                      className="text-sky-500 hover:text-sky-600 p-1"
                      title="Edit education"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(education.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Delete education"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Education Details */}
                <div className="flex flex-col">
                  {education.country && (
                    <div className="flex items-start gap-4 lg:gap-[45px] px-2.5 py-[3px]">
                      <span className="text-black text-sm lg:text-[15px] font-normal w-[120px] lg:w-[150px] flex-shrink-0">Country</span>
                      <span className="text-hrms-text-secondary text-sm lg:text-[15px] font-normal">{education.country}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-4 lg:gap-[45px] px-2.5 py-[3px]">
                    <span className="text-black text-sm lg:text-[15px] font-normal w-[120px] lg:w-[150px] flex-shrink-0">Degree</span>
                    <span className="text-hrms-text-secondary text-sm lg:text-[15px] font-normal">{education.degree}</span>
                  </div>
                  {education.fieldOfStudy && (
                    <div className="flex items-start gap-4 lg:gap-[45px] px-2.5 py-[3px]">
                      <span className="text-black text-sm lg:text-[15px] font-normal w-[120px] lg:w-[150px] flex-shrink-0">Field of Study</span>
                      <span className="text-hrms-text-secondary text-sm lg:text-[15px] font-normal">{education.fieldOfStudy}</span>
                    </div>
                  )}
                  {education.gpa && (
                    <div className="flex items-start gap-4 lg:gap-[45px] px-2.5 py-[3px]">
                      <span className="text-black text-sm lg:text-[15px] font-normal w-[120px] lg:w-[150px] flex-shrink-0">GPA</span>
                      <span className="text-hrms-text-secondary text-sm lg:text-[15px] font-normal">{education.gpa.toFixed(2)}/4.0</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No education records found. Click "Add New" to add one.
            </div>
          )}
        </div>

        {/* Add Education Link */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-[5px] p-2.5 hover:opacity-80 w-fit"
        >
          <BookOpen className="w-[30px] h-[30px] lg:w-[35px] lg:h-[35px] text-[#0088FF]" />
          <span className="text-hrms-primary text-sm lg:text-base font-medium underline decoration-hrms-primary">
            Add Education
          </span>
        </button>
      </div>

      {/* Edit Education Modal */}
      <EducationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEducationId(null);
        }}
        title="Edit Education"
        submitLabel="Update Changes"
        initialValues={getEditInitialValues()}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />

      {/* Add Education Modal */}
      <EducationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Education"
        submitLabel="Add Education"
        initialValues={addInitialValues}
        onSubmit={handleAddSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}


