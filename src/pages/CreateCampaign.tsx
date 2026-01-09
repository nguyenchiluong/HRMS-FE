import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { campaignSchema } from '@/schemas/campaignSchema';
import type { CampaignFormData } from '@/types/campaign';
import { useFormik } from 'formik';
import {
  Activity,
  ArrowLeft,
  Calendar,
  Loader2,
  TrendingUp,
  Upload,
  X,
  Target, // 👈 Import icon Target
} from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ACTIVITY_TYPES = [
  {
    id: 'walking' as const,
    name: 'Walking',
    icon: Activity,
    description: 'Step counting and walking activities',
    color: 'text-green-500',
  },
  {
    id: 'running' as const,
    name: 'Running',
    icon: TrendingUp,
    description: 'Running and jogging activities',
    color: 'text-blue-500',
  },
  {
    id: 'cycling' as const,
    name: 'Cycling',
    icon: Activity,
    description: 'Cycling and biking activities',
    color: 'text-purple-500',
  },
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const createMutation = useCreateCampaign();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const formik = useFormik<CampaignFormData>({
    initialValues: {
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDate: '',
      endTime: '17:00',
      activityType: '' as any,
      targetGoal: 100, // 👈 THÊM: Giá trị mặc định
      imageFile: undefined,
    },
    validationSchema: campaignSchema,
    onSubmit: async (values) => {
      try {
        await createMutation.mutateAsync(values);
        toast.success('Campaign created successfully!', {
          duration: 3000,
          position: 'top-right',
        });

        setTimeout(() => {
          navigate('/admin/campaigns');
        }, 1000);
      } catch (error) {
        console.error('Failed to create campaign:', error);
        toast.error('Failed to create campaign. Please try again.', {
          duration: 5000,
        });
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('imageFile', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue('imageFile', undefined);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper để hiển thị label unit
  const getUnitLabel = () => {
     const type = formik.values.activityType;
     if (['walking', 'running', 'cycling'].includes(type)) return "km";
     return "points";
  };

  const isFormValid = formik.isValid && formik.dirty;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Set up a new employee activity campaign
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Campaign Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Campaign Image
            </CardTitle>
            <CardDescription>
              Upload an image for your campaign (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* ... (Giữ nguyên phần upload ảnh cũ) ... */}
            <div className="space-y-4">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-64 w-full rounded-lg border object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium text-foreground">
                    Upload Campaign Image
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Campaign Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Company Walking Challenge 2025"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.name && formik.errors.name
                    ? 'border-destructive'
                    : ''
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the campaign goals, rules, and benefits for participants..."
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.description && formik.errors.description
                    ? 'border-destructive'
                    : ''
                }
              />
               {/* ... Error message ... */}
              <p className="text-xs text-muted-foreground">
                {formik.values.description.length}/1000 characters
              </p>
            </div>

            {/* 👇 THÊM: Input Target Goal */}
            <div className="space-y-2">
               <label htmlFor="targetGoal" className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" /> 
                  Campaign Target Goal *
               </label>
               <div className="relative">
                 <Input
                    id="targetGoal"
                    name="targetGoal"
                    type="number"
                    placeholder="e.g. 100"
                    value={formik.values.targetGoal}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={1}
                 />
                 <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">
                    {getUnitLabel()}
                 </span>
               </div>
               <p className="text-xs text-muted-foreground">
                  The goal for the progress bar (e.g., 100 km for walking/running).
               </p>
            </div>

          </CardContent>
        </Card>

        {/* Campaign Duration - Giữ nguyên */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Campaign Duration
            </CardTitle>
             {/* ... */}
          </CardHeader>
          <CardContent>
             {/* ... Grid Date/Time inputs cũ giữ nguyên ... */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Start Date *</label>
                    <Input id="startDate" name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="startTime" className="text-sm font-medium">Start Time *</label>
                    <Input id="startTime" name="startTime" type="time" value={formik.values.startTime} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">End Date *</label>
                    <Input id="endDate" name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="endTime" className="text-sm font-medium">End Time *</label>
                    <Input id="endTime" name="endTime" type="time" value={formik.values.endTime} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Activity Type Selection - Giữ nguyên */}
        <Card>
           {/* ... Giữ nguyên phần chọn Activity Type ... */}
           <CardHeader>
            <CardTitle>Activity Type *</CardTitle>
            <CardDescription>Choose the type of activity for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                 {ACTIVITY_TYPES.map((activity) => (
                    <div 
                        key={activity.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            formik.values.activityType === activity.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => formik.setFieldValue('activityType', activity.id)}
                    >
                         {/* ... Render icon/text ... */}
                         <div className="mb-2 flex items-center gap-3">
                           <activity.icon className={`h-5 w-5 ${activity.color}`} />
                           <span className="font-semibold">{activity.name}</span>
                         </div>
                         <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                 ))}
             </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3">
           {/* ... Buttons ... */}
           <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
           <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Campaign'}
           </Button>
        </div>
      </form>
    </div>
  );
}