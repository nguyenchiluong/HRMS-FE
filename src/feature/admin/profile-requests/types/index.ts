// Profile Change Request Status
export const ProfileRequestStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export type ProfileRequestStatus =
  (typeof ProfileRequestStatus)[keyof typeof ProfileRequestStatus];

// Field types that can be changed
export type ChangeableField =
  | 'legal-full-name'
  | 'date-of-birth'
  | 'national-id'
  | 'social-insurance-number'
  | 'passport-number'
  | 'phone-number'
  | 'personal-email'
  | 'address'
  | 'emergency-contact'
  | 'bank-account'
  | 'other';

// Profile Change Request
export interface ProfileChangeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar?: string;
  department: string;
  field: ChangeableField;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  requestDate: Date;
  status: ProfileRequestStatus;
  reason?: string; // Employee's reason for the change
  adminNotes?: string; // Admin's notes when approving/rejecting
  attachments?: string[]; // URLs to supporting documents
}

// Stats for dashboard
export interface ProfileRequestStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
