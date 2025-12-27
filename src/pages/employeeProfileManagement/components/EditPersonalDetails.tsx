import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Calendar, Pencil } from "lucide-react";

interface FormRowProps {
  label: string;
  value: string;
  icon?: "list" | "calendar" | "edit";
  editable?: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  options?: string[];
}

function FormRow({ 
  label, 
  value, 
  icon = "edit", 
  editable = true, 
  isEditing, 
  onEdit, 
  onChange,
  options 
}: FormRowProps) {
  return (
    <div className="flex flex-col lg:flex-row py-1.5 px-2.5 gap-2 lg:gap-[45px]">
      <div className="w-full lg:w-[240px] text-black text-base lg:text-[17px] font-medium flex-shrink-0">
        {label}
      </div>
      <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
        {isEditing ? (
          icon === "list" && options ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 text-base lg:text-[17px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hrms-primary"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : icon === "calendar" ? (
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 text-base lg:text-[17px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hrms-primary"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 text-base lg:text-[17px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hrms-primary"
            />
          )
        ) : (
          <span className="text-gray-600 text-base lg:text-[17px] font-normal break-words flex-1">
            {value}
          </span>
        )}
        {editable && (
          <button 
            onClick={onEdit}
            className="p-0 border-0 bg-transparent cursor-pointer flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            {icon === "list" && <List className="w-5 h-5 lg:w-6 lg:h-6 text-[#65686B]" />}
            {icon === "calendar" && <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-[#C4C4C4]" />}
            {icon === "edit" && <Pencil className="w-5 h-5 lg:w-6 lg:h-6 text-[#999999]" />}
          </button>
        )}
      </div>
    </div>
  );
}

interface PersonalDetailsForm {
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  pronoun: string;
  personalEmail: string;
  permanentAddress: string;
  currentAddress: string;
  phoneNumber1: string;
  phoneNumber2: string;
  preferredName: string;
}

const initialData: PersonalDetailsForm = {
  sex: "Male",
  dateOfBirth: "2003-07-02",
  maritalStatus: "Single",
  pronoun: "he/him",
  personalEmail: "kietnguyennumber1@gmail.com",
  permanentAddress: "713 An Duong Vuong, Binh Tan District, Ho Chi Minh City",
  currentAddress: "713 An Duong Vuong, Binh Tan District, Ho Chi Minh City",
  phoneNumber1: "+84 89 949 6257",
  phoneNumber2: "(empty)",
  preferredName: "Nguyen Kid (Nguyen Tuan Kiet)",
};

export default function EditPersonalDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PersonalDetailsForm>(initialData);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetailsForm, string>>>({});

  const handleFieldChange = (field: keyof PersonalDetailsForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts editing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalDetailsForm, string>> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.personalEmail || !emailRegex.test(formData.personalEmail)) {
      newErrors.personalEmail = "Please enter a valid email address";
    }

    // Phone number validation (basic check)
    if (!formData.phoneNumber1 || formData.phoneNumber1.trim() === "" || formData.phoneNumber1 === "(empty)") {
      newErrors.phoneNumber1 = "Phone number is required";
    }

    // Required fields
    if (!formData.sex || formData.sex.trim() === "") {
      newErrors.sex = "Sex is required";
    }

    if (!formData.dateOfBirth || formData.dateOfBirth.trim() === "") {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.maritalStatus || formData.maritalStatus.trim() === "") {
      newErrors.maritalStatus = "Marital status is required";
    }

    if (!formData.permanentAddress || formData.permanentAddress.trim() === "") {
      newErrors.permanentAddress = "Permanent address is required";
    }

    if (!formData.currentAddress || formData.currentAddress.trim() === "") {
      newErrors.currentAddress = "Current address is required";
    }

    if (!formData.preferredName || formData.preferredName.trim() === "") {
      newErrors.preferredName = "Preferred name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateChanges = () => {
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    // TODO: Add API call to save changes
    console.log("Saving changes:", formData);
    setEditingField(null);
    
    // Show success message and navigate back
    alert("Changes updated successfully!");
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB").replace(/\//g, "/");
  };

  return (
    <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
      <h2 className="text-xl lg:text-[25px] font-semibold text-black">
        Edit Personal Details
      </h2>

      <div className="flex flex-col py-2.5 gap-2.5">
        <FormRow 
          label="Sex" 
          value={formData.sex} 
          icon="list"
          isEditing={editingField === "sex"}
          onEdit={() => setEditingField(editingField === "sex" ? null : "sex")}
          onChange={(value) => handleFieldChange("sex", value)}
          options={["Male", "Female", "Other", "Prefer not to say"]}
        />
        <FormRow 
          label="Date of Birth" 
          value={editingField === "dateOfBirth" ? formData.dateOfBirth : formatDate(formData.dateOfBirth)} 
          icon="calendar"
          isEditing={editingField === "dateOfBirth"}
          onEdit={() => setEditingField(editingField === "dateOfBirth" ? null : "dateOfBirth")}
          onChange={(value) => handleFieldChange("dateOfBirth", value)}
        />
        <FormRow 
          label="Marital Status" 
          value={formData.maritalStatus} 
          icon="list"
          isEditing={editingField === "maritalStatus"}
          onEdit={() => setEditingField(editingField === "maritalStatus" ? null : "maritalStatus")}
          onChange={(value) => handleFieldChange("maritalStatus", value)}
          options={["Single", "Married", "Divorced", "Widowed"]}
        />
        <FormRow 
          label="Pronoun" 
          value={formData.pronoun} 
          icon="list"
          isEditing={editingField === "pronoun"}
          onEdit={() => setEditingField(editingField === "pronoun" ? null : "pronoun")}
          onChange={(value) => handleFieldChange("pronoun", value)}
          options={["he/him", "she/her", "they/them", "other"]}
        />
        <FormRow
          label="Personal Email Address"
          value={formData.personalEmail}
          icon="edit"
          isEditing={editingField === "personalEmail"}
          onEdit={() => setEditingField(editingField === "personalEmail" ? null : "personalEmail")}
          onChange={(value) => handleFieldChange("personalEmail", value)}
        />
        <FormRow
          label="Permanent Address"
          value={formData.permanentAddress}
          icon="edit"
          isEditing={editingField === "permanentAddress"}
          onEdit={() => setEditingField(editingField === "permanentAddress" ? null : "permanentAddress")}
          onChange={(value) => handleFieldChange("permanentAddress", value)}
        />
        <FormRow
          label="Current Address"
          value={formData.currentAddress}
          icon="edit"
          isEditing={editingField === "currentAddress"}
          onEdit={() => setEditingField(editingField === "currentAddress" ? null : "currentAddress")}
          onChange={(value) => handleFieldChange("currentAddress", value)}
        />
        <FormRow 
          label="Phone Number (1)" 
          value={formData.phoneNumber1} 
          icon="edit"
          isEditing={editingField === "phoneNumber1"}
          onEdit={() => setEditingField(editingField === "phoneNumber1" ? null : "phoneNumber1")}
          onChange={(value) => handleFieldChange("phoneNumber1", value)}
        />
        <FormRow 
          label="Phone Number (2)" 
          value={formData.phoneNumber2} 
          icon="edit"
          isEditing={editingField === "phoneNumber2"}
          onEdit={() => setEditingField(editingField === "phoneNumber2" ? null : "phoneNumber2")}
          onChange={(value) => handleFieldChange("phoneNumber2", value)}
        />
        <FormRow
          label="Preferred Name"
          value={formData.preferredName}
          icon="edit"
          isEditing={editingField === "preferredName"}
          onEdit={() => setEditingField(editingField === "preferredName" ? null : "preferredName")}
          onChange={(value) => handleFieldChange("preferredName", value)}
        />
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 lg:gap-[50px]">
        <button 
          onClick={handleUpdateChanges}
          className="w-full lg:w-auto px-6 lg:px-[38px] py-3 lg:py-[15px] rounded-[25px] bg-hrms-primary text-white font-medium text-lg lg:text-xl hover:bg-hrms-primary/90 transition-colors"
        >
          Update Changes
        </button>
        <button 
          onClick={handleCancel}
          className="w-full lg:w-auto px-6 lg:px-12 py-3 lg:py-[15px] rounded-[25px] bg-hrms-bg-light text-hrms-text-primary font-medium text-lg lg:text-xl hover:bg-hrms-bg-light/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}