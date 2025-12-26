export type RequestType =
  | 'paid-leave'
  | 'unpaid-leave'
  | 'paid-sick-leave'
  | 'unpaid-sick-leave'
  | 'wfh';

export interface RequestOption {
  id: RequestType;
  label: string;
  icon: React.ElementType;
  iconColor: string;
}

export interface TimeOffFormData {
  requestType: RequestType | null;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
}
