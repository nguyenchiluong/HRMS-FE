import * as Yup from 'yup';

export const campaignSchema = Yup.object({
  name: Yup.string()
    .required('Campaign name is required')
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must be less than 100 characters'),
  
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  startDate: Yup.string()
    .required('Start date is required'),
  
  startTime: Yup.string()
    .required('Start time is required'),
  
  endDate: Yup.string()
    .required('End date is required')
    .test(
      'is-after-start',
      'End date must be after start date',
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
  
  endTime: Yup.string()
    .required('End time is required'),
  
  activityType: Yup.string()
    .oneOf(['walking', 'running', 'cycling'], 'Please select an activity type')
    .required('Activity type is required'),
  
  imageFile: Yup.mixed<File>()
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true; // Optional field
      return value.size <= 5 * 1024 * 1024; // 5MB max
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type);
    })
});