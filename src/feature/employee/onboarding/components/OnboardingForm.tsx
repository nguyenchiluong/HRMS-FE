import { Button } from '@/components/ui/button';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { OnboardingFormValues } from '../types';
import { FileUpload } from './ui/FileUpload';
import { FormRow } from './ui/FormRow';
import { SectionHeader } from './ui/SectionHeader';

const initialValues: OnboardingFormValues = {
  firstName: '',
  lastName: '',
  fullName: '',
  sex: '',
  dob: '',
  maritalStatus: '',
  pronoun: '',
  personalEmail: '',
  permanentAddress: '',
  currentAddress: '',
  phone1: '',
  phone2: '',
  preferredName: '',
  highestDegree: '',
  educationCountry: '',
  institution: '',
  startYear: '',
  endYear: '',
  averageGrade: '',
  nationalIdCountry: '',
  identificationNumber: '',
  issuedDate: '',
  expirationDate: '',
  issuedBy: '',
  socialInsuranceId: '',
  taxId: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  comments: '',
  attachments: [],
};

export const OnboardingForm: React.FC = () => {
  const handleSubmit = (values: OnboardingFormValues) => {
    console.log('Form Submitted', values);
    alert('Form submitted successfully! Check console for data.');
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form className="w-full">
          {/* Two Column Layout for Main Sections */}
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
            {/* Left Column */}
            <div className="flex flex-col gap-10">
              {/* Personal Details */}
              <div>
                <SectionHeader title="Personal Details" />
                <div className="space-y-0.5">
                  <FormRow label="First Name" name="firstName" />
                  <FormRow label="Last Name" name="lastName" />
                  <FormRow label="Full Name" name="fullName" />
                  <FormRow
                    label="Sex"
                    name="sex"
                    type="select"
                    options={['Male', 'Female', 'Other']}
                  />
                  <FormRow label="Date of Birth" name="dob" type="date" />
                  <FormRow
                    label="Marital Status"
                    name="maritalStatus"
                    type="select"
                    options={['Single', 'Married', 'Divorced']}
                  />
                  <FormRow
                    label="Pronoun"
                    name="pronoun"
                    type="select"
                    options={['He/Him', 'She/Her', 'They/Them']}
                  />
                  <FormRow
                    label="Personal Email Address"
                    name="personalEmail"
                  />
                  <FormRow label="Permanent Address" name="permanentAddress" />
                  <FormRow label="Current Address" name="currentAddress" />
                  <FormRow label="Phone Number (1)" name="phone1" />
                  <FormRow label="Phone Number (2)" name="phone2" />
                  <FormRow label="Preferred Name" name="preferredName" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-10">
              {/* National ID */}
              <div>
                <SectionHeader title="National ID" />
                <div className="space-y-1">
                  <FormRow
                    label="Country"
                    name="nationalIdCountry"
                    type="select"
                    options={['Vietnam', 'USA']}
                  />
                  <FormRow
                    label="Identification #"
                    name="identificationNumber"
                  />
                  <FormRow label="Issued Date" name="issuedDate" />
                  <FormRow
                    label="Expiration Date"
                    name="expirationDate"
                    type="date"
                  />
                  <FormRow
                    label="Issued By"
                    name="issuedBy"
                    type="select"
                    options={['Dept of Justice', 'Police']}
                  />
                </div>
              </div>

              {/* Social Insurance */}
              <div>
                <SectionHeader title="Social Insurance Number" />
                <div className="space-y-1">
                  <FormRow label="Identification #" name="socialInsuranceId" />
                </div>
              </div>

              {/* Tax ID */}
              <div>
                <SectionHeader title="Tax ID" />
                <div className="space-y-1">
                  <FormRow label="Identification #" name="taxId" />
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 border-t border-gray-100"></div>

          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
            {/* Education Details */}
            <div>
              <SectionHeader title="Education Details" optional />
              <div className="space-y-1">
                <FormRow
                  label="Your Highest Degree"
                  name="highestDegree"
                  type="select"
                  options={['Bachelor', 'Master', 'PhD']}
                />
                <FormRow
                  label="Country"
                  name="educationCountry"
                  type="select"
                  options={['Vietnam', 'USA', 'UK']}
                />
                <FormRow
                  label="Institution"
                  name="institution"
                  type="select"
                  options={['University A', 'University B']}
                />
                <FormRow
                  label="Start Year"
                  name="startYear"
                  type="select"
                  options={['2020', '2021', '2022']}
                />
                <FormRow
                  label="End Year"
                  name="endYear"
                  type="select"
                  options={['2023', '2024', '2025']}
                />
                <FormRow label="Average Grade" name="averageGrade" />
              </div>
            </div>
            {/* Financial Details Section */}
            <div>
              <SectionHeader title="Financial Details" />
              <div className="space-y-1">
                <FormRow
                  label="Bank Name"
                  name="bankName"
                  type="select"
                  options={['VCB', 'ACB', 'Techcombank']}
                />
                <FormRow label="Account Number" name="accountNumber" />
                <FormRow label="Account Name" name="accountName" />
              </div>
            </div>
          </div>

          {/* Full Width Sections */}
          <div className="mt-10">
            <h3 className="mb-2 text-sm font-medium text-slate-700">
              Your comment
            </h3>
            <Field
              as="textarea"
              name="comments"
              rows={4}
              className="w-full resize-none rounded-lg border-none bg-gray-100 p-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <FileUpload />

          {/* Submit Button */}
          <div className="mb-20 mt-12 flex justify-center">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full rounded-full px-12 shadow-lg sm:w-auto"
            >
              Submit Form
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
