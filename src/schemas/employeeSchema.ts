import * as Yup from 'yup';

export const initialProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  positionId: Yup.number()
    .required('Position is required')
    .positive('Please select a position'),
  jobLevel: Yup.string()
    .required('Job level is required')
    .oneOf(
      ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager'],
      'Invalid job level',
    ),
  departmentId: Yup.number()
    .required('Department is required')
    .positive('Please select a department'),
  employeeType: Yup.string()
    .required('Employee type is required')
    .oneOf(
      ['FullTime', 'PartTime', 'Contract', 'Intern'],
      'Invalid employee type',
    ),
  timeType: Yup.string()
    .required('Time type is required')
    .oneOf(['OnSite', 'Remote', 'Hybrid'], 'Invalid time type'),
  startDate: Yup.string().required('Start date is required'),
});
