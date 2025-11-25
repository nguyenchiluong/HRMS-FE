import { Edit, List, Calendar, X, File, Image, FileText } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import type { FormikProps } from "formik";
import * as Yup from "yup";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormFieldRowProps {
  label: string;
  name: string;
  type?: string;
  icon?: "edit" | "list" | "calendar";
  placeholder?: string;
}

function FormFieldRow({ label, name, type = "text", icon = "edit", placeholder }: FormFieldRowProps) {
  const IconComponent = icon === "list" ? List : icon === "calendar" ? Calendar : Edit;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 lg:gap-11 px-2.5 py-1.5">
      <Label className="w-full sm:w-48 lg:w-60 text-hrms-text-primary text-sm lg:text-[17px] font-medium flex-shrink-0">
        {label}
      </Label>
      <div className="flex-1 sm:w-[200px] lg:w-[255px] flex flex-col">
        <Field
          as={type === "textarea" ? Textarea : Input}
          name={name}
          type={type}
          placeholder={placeholder}
          className="text-hrms-text-secondary text-sm lg:text-[17px] font-normal"
        />
        <ErrorMessage
          name={name}
          component="div"
          className="text-destructive text-xs mt-1"
        />
      </div>
      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-hrms-text-muted flex-shrink-0" strokeWidth={2} />
    </div>
  );
}

interface SelectFieldRowProps {
  label: string;
  name: string;
  icon?: "edit" | "list" | "calendar";
  options: { value: string; label: string }[];
}

function SelectFieldRow({ label, name, icon = "list", options }: SelectFieldRowProps) {
  const IconComponent = icon === "list" ? List : icon === "calendar" ? Calendar : Edit;
  const [field, meta, helpers] = useField(name);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 lg:gap-11 px-2.5 py-1.5">
      <Label className="w-full sm:w-48 lg:w-60 text-hrms-text-primary text-sm lg:text-[17px] font-medium flex-shrink-0">
        {label}
      </Label>
      <div className="flex-1 sm:w-[200px] lg:w-[255px] flex flex-col">
        <Select
          value={field.value}
          onValueChange={(value) => helpers.setValue(value)}
        >
          <SelectTrigger className="text-hrms-text-secondary text-sm lg:text-[17px] font-normal">
            <SelectValue placeholder="Select..." />
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
          <div className="text-destructive text-xs mt-1">
            {meta.error}
          </div>
        )}
      </div>
      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-hrms-text-muted flex-shrink-0" strokeWidth={2} />
    </div>
  );
}

interface FormValues {
  legalFullName: string;
  nationality: string;
  nationalIdNumber: string;
  nationalIdIssuedDate: string;
  nationalIdExpirationDate: string;
  nationalIdIssuedBy: string;
  socialInsuranceNumber: string;
  taxIdNumber: string;
  comment: string;
  attachments: FileList | null;
}

const validationSchema = Yup.object({
  legalFullName: Yup.string()
    .required("Legal full name is required")
    .min(2, "Legal full name must be at least 2 characters"),
  nationality: Yup.string()
    .required("Nationality is required"),
  nationalIdNumber: Yup.string()
    .required("National ID number is required"),
  nationalIdIssuedDate: Yup.string()
    .required("Issued date is required"),
  nationalIdExpirationDate: Yup.string()
    .required("Expiration date is required")
    .test("is-after-issued", "Expiration date must be after issued date", function(this: Yup.TestContext, value: string) {
      const { nationalIdIssuedDate } = this.parent;
      if (!value || !nationalIdIssuedDate) return true;
      return new Date(value) > new Date(nationalIdIssuedDate);
    }),
  nationalIdIssuedBy: Yup.string()
    .required("Issued by is required"),
  socialInsuranceNumber: Yup.string()
    .required("Social insurance number is required"),
  taxIdNumber: Yup.string()
    .required("Tax ID number is required"),
  comment: Yup.string(),
});

const nationalityOptions = [
  { value: "Vietnam", label: "Vietnam" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "South Korea", label: "South Korea" },
  { value: "China", label: "China" },
  { value: "India", label: "India" },
  { value: "Singapore", label: "Singapore" },
  { value: "Thailand", label: "Thailand" },
  { value: "Philippines", label: "Philippines" },
  { value: "Malaysia", label: "Malaysia" },
];

const initialValues: FormValues = {
  legalFullName: "Nguyen Tuan Kiet",
  nationality: "Vietnam",
  nationalIdNumber: "715900132",
  nationalIdIssuedDate: "2021-04-22",
  nationalIdExpirationDate: "2028-09-25",
  nationalIdIssuedBy: "Director General of The Police Department",
  socialInsuranceNumber: "5220031234",
  taxIdNumber: "5220031234",
  comment: "",
  attachments: null,
};

export default function EditIDsContent() {
  const fileUrlsRef = useRef<Map<File, string>>(new Map());
  const navigate = useNavigate();

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    // Handle form submission here
    // You can add API call or other logic

    // Navigate back to the previous page after successful submission
    navigate(-1);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      fileUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      fileUrlsRef.current.clear();
    };
  }, []);

  return (
    <div className="flex-1 bg-hrms-bg-page">
      <div className="bg-white rounded-[25px] px-4 lg:px-[45px] py-4 lg:py-[30px] pb-8 lg:pb-12">
        <h2 className="text-hrms-text-primary text-xl lg:text-[25px] font-semibold mb-2.5">
          Edit Your IDs
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, values }: FormikProps<FormValues>) => (
            <Form className="pb-4">
              <div className="flex flex-col gap-2.5 pb-[30px] mb-2.5">
                <FormFieldRow
                  label="Legal Full Name"
                  name="legalFullName"
                  icon="edit"
                />
                <SelectFieldRow
                  label="Nationality"
                  name="nationality"
                  icon="list"
                  options={nationalityOptions}
                />
              </div>

              <h3 className="text-hrms-primary text-sm lg:text-[17px] font-medium mb-2.5">
                National ID
              </h3>

              <div className="flex flex-col gap-2.5 pb-[30px] mb-2.5">
                <FormFieldRow
                  label="Identification #"
                  name="nationalIdNumber"
                  icon="edit"
                />
                <FormFieldRow
                  label="Issued Date"
                  name="nationalIdIssuedDate"
                  type="date"
                  icon="calendar"
                />
                <FormFieldRow
                  label="Expiration Date"
                  name="nationalIdExpirationDate"
                  type="date"
                  icon="calendar"
                />
                <FormFieldRow
                  label="Issued By"
                  name="nationalIdIssuedBy"
                  icon="edit"
                />
              </div>

              <h3 className="text-hrms-primary text-sm lg:text-[17px] font-medium mb-2.5">
                Social Insurance Number ID
              </h3>

              <div className="flex flex-col gap-2.5 pb-[30px] mb-2.5">
                <FormFieldRow
                  label="Identification #"
                  name="socialInsuranceNumber"
                  icon="edit"
                />
              </div>

              <h3 className="text-hrms-primary text-sm lg:text-[17px] font-medium mb-2.5">
                Tax ID
              </h3>

              <div className="flex flex-col gap-2.5 pb-[30px] mb-2.5">
                <FormFieldRow
                  label="Identification #"
                  name="taxIdNumber"
                  icon="edit"
                />
              </div>

              <div className="flex flex-col gap-2.5 px-2.5 mb-2.5">
                <Label className="text-hrms-text-primary text-sm lg:text-[17px] font-normal">
                  Your comment
                </Label>
                <Field
                  as={Textarea}
                  name="comment"
                  placeholder="Enter your comment..."
                  className="h-24 lg:h-[125px] bg-secondary rounded-[20px] text-hrms-text-secondary text-sm lg:text-[17px] font-normal"
                />
                <ErrorMessage
                  name="comment"
                  component="div"
                  className="text-destructive text-xs mt-1"
                />
              </div>

              <div className="flex flex-col gap-2.5 px-2.5 mb-2.5">
                <Label className="text-hrms-text-primary text-lg lg:text-[25px] font-semibold">
                  Attachments <span className="text-destructive">*</span>
                </Label>
                <div className="h-32 lg:h-[200px] bg-secondary rounded-[20px] flex items-center justify-center relative border-2 border-dashed border-input">
                  <input
                    type="file"
                    multiple
                    onChange={(event) => {
                      const newFiles = event.currentTarget.files;
                      if (newFiles && newFiles.length > 0) {
                        const dt = new DataTransfer();
                        // Add existing files
                        if (values.attachments) {
                          Array.from(values.attachments).forEach((file) => dt.items.add(file));
                        }
                        // Add new files
                        Array.from(newFiles).forEach((file) => dt.items.add(file));
                        setFieldValue("attachments", dt.files);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="*/*"
                    id="file-input"
                  />
                  {!values.attachments || values.attachments.length === 0 ? (
                    <label
                      htmlFor="file-input"
                      className="px-8 lg:px-[54px] py-2 lg:py-3 bg-hrms-bg-light rounded-[30px] text-hrms-text-primary text-base lg:text-[25px] font-normal hover:bg-hrms-bg-light/80 cursor-pointer"
                    >
                      Select files
                    </label>
                  ) : (
                    <label
                      htmlFor="file-input"
                      className="px-8 lg:px-[54px] py-2 lg:py-3 bg-hrms-bg-light rounded-[30px] text-hrms-text-primary text-base lg:text-[25px] font-normal hover:bg-hrms-bg-light/80 cursor-pointer"
                    >
                      Add more files
                    </label>
                  )}
                </div>
                
                {values.attachments && values.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Array.from(values.attachments).map((file, index) => {
                      const isImage = file.type.startsWith("image/");
                      const fileSize = (file.size / 1024).toFixed(2); // Size in KB
                      const fileIcon = isImage ? Image : file.type.includes("pdf") ? FileText : File;
                      const FileIcon = fileIcon;
                      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
                      
                      // Get or create object URL for images
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
                          className="flex items-center gap-3 p-3 bg-hrms-bg-light rounded-[15px] border border-input"
                        >
                          {isImage ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-6 h-6 text-hrms-text-muted" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm lg:text-base font-medium text-hrms-text-primary truncate">
                              {file.name}
                            </p>
                            <p className="text-xs lg:text-sm text-hrms-text-secondary">
                              {Number(fileSize) > 1024
                                ? `${(Number(fileSize) / 1024).toFixed(2)} MB`
                                : `${fileSize} KB`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              // Clean up object URL if it's an image
                              if (isImage && fileUrlsRef.current.has(file)) {
                                const url = fileUrlsRef.current.get(file);
                                if (url) {
                                  URL.revokeObjectURL(url);
                                }
                                fileUrlsRef.current.delete(file);
                              }
                              
                              const dt = new DataTransfer();
                              Array.from(values.attachments || []).forEach((f, i) => {
                                if (i !== index) {
                                  dt.items.add(f);
                                }
                              });
                              setFieldValue("attachments", dt.files.length > 0 ? dt.files : null);
                            }}
                            className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                            aria-label="Remove file"
                          >
                            <X className="w-5 h-5 text-hrms-text-muted hover:text-destructive" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {errors.attachments && touched.attachments && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.attachments}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-[50px] mt-6 lg:mt-8 mb-4 px-2.5">
                <button
                  type="submit"
                  className="px-6 lg:px-[38px] py-3 lg:py-[15px] bg-hrms-primary rounded-[25px] text-white text-base lg:text-xl font-medium hover:bg-hrms-primary/90 transition-colors w-full sm:w-auto"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 lg:px-12 py-3 lg:py-[15px] bg-hrms-bg-light rounded-[25px] text-hrms-text-primary text-base lg:text-xl font-medium hover:bg-hrms-bg-light/80 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
