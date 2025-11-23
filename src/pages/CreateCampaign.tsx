import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { campaignSchema } from '@/schemas/campaignSchema';
import type { CampaignFormData } from '@/types/campaign';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Activity, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ACTIVITY_TYPES = [
  {
    id: 'walking' as const,
    name: 'Walking',
    icon: Activity,
    description: 'Step counting and walking activities',
    color: 'text-green-500'
  },
  {
    id: 'running' as const,
    name: 'Running', 
    icon: TrendingUp,
    description: 'Running and jogging activities',
    color: 'text-blue-500'
  },
  {
    id: 'cycling' as const,
    name: 'Cycling',
    icon: Activity,
    description: 'Cycling and biking activities',
    color: 'text-purple-500'
  }
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const createMutation = useCreateCampaign();

  const formik = useFormik<CampaignFormData>({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '17:00',
      activityType: '' as any
    },
    validationSchema: campaignSchema,
    onSubmit: async (values) => {
      try {
        await createMutation.mutateAsync(values);
        // Success handling - could show toast or navigate
        toast.success('Campaign created successfully!', {
          duration: 3000,
          position: 'top-right',
        });
        
        // Navigate sau khi hiển thị toast
        setTimeout(() => {
          navigate('/campaigns');
        }, 1000);
      } catch (error) {
        console.error('Failed to create campaign:', error);

        toast.error('Failed to create campaign. Please try again.', {
          duration: 5000,
        });
      }
    }
  });

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
          <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
          <p className="text-muted-foreground">Set up a new employee activity campaign</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                className={formik.touched.name && formik.errors.name ? 'border-destructive' : ''}
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
                className={formik.touched.description && formik.errors.description ? 'border-destructive' : ''}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">{formik.errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formik.values.description.length}/1000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Campaign Duration
            </CardTitle>
            <CardDescription>
              Set the start and end dates for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date *
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.startDate && formik.errors.startDate ? 'border-destructive' : ''}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="text-sm text-destructive">{formik.errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="startTime" className="text-sm font-medium">
                  Start Time *
                </label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date *
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.endDate && formik.errors.endDate ? 'border-destructive' : ''}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <p className="text-sm text-destructive">{formik.errors.endDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-medium">
                  End Time *
                </label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Type *</CardTitle>
            <CardDescription>
              Choose the type of activity for this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ACTIVITY_TYPES.map((activity) => {
                const Icon = activity.icon;
                const isSelected = formik.values.activityType === activity.id;
                
                return (
                  <div
                    key={activity.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => formik.setFieldValue('activityType', activity.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                      <span className="font-semibold text-foreground">
                        {activity.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    {isSelected && (
                      <div className="mt-2 text-xs text-primary font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {formik.touched.activityType && formik.errors.activityType && (
              <p className="text-sm text-destructive mt-2">{formik.errors.activityType}</p>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isFormValid || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Campaign'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}