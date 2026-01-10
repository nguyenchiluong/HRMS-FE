import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useUpdateActivity } from "@/hooks/useCampaigns";
import { Calendar, Loader2, MapPin, X } from "lucide-react";
import type { EmployeeActivity } from "@/types/campaign";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditActivityModalProps {
  activity: EmployeeActivity;
  campaign: any; // Trong object này đã có id, startDate, endDate
  onClose: () => void;
}

export default function EditActivityModal({ activity, campaign, onClose }: EditActivityModalProps) {
  const updateMutation = useUpdateActivity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialDistance = (() => {
    try { return JSON.parse(activity.metrics).distance || ""; } catch { return ""; }
  })();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validationSchema = Yup.object({
    activityDate: Yup.date()
      .required("Activity date is required")
      .min(
        new Date(new Date(campaign?.startDate).setHours(0, 0, 0, 0)),
        `Date must be from ${new Date(campaign?.startDate).toLocaleDateString()}`
      )
      .max(
        new Date(new Date(campaign?.endDate).setHours(23, 59, 59, 999)),
        `Date must be before or on ${new Date(campaign?.endDate).toLocaleDateString()}`
      )
      .max(new Date(), "Cannot submit future activities"),
    distance: Yup.number()
      .required("Distance is required")
      .positive("Distance must be positive")
      .typeError("Must be a number"),
    imageFile: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      activityDate: activity.activityDate,
      distance: initialDistance,
      imageFile: null as File | null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateMutation.mutateAsync({
          id: activity.activityId,
          data: {
            campaignId: campaign.id, // Lấy ID từ object campaign
            activityDate: values.activityDate,
            distance: Number(values.distance),
            imageFile: values.imageFile || undefined 
          } as any 
        });
        onClose();
      } catch (error: any) {
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("imageFile", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeNewFile = () => {
      formik.setFieldValue("imageFile", null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-5 py-2">
          
          {/* 1. Date Input */}
          <div className="space-y-2">
            <Label htmlFor="activityDate">Activity Date <span className="text-red-500">*</span></Label>
            <div className="relative">
                <Input 
                id="activityDate" 
                type="date" 
                {...formik.getFieldProps("activityDate")}
                className={formik.errors.activityDate && formik.touched.activityDate ? "border-red-500 pr-10" : "pr-10"}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* Thêm 'as string' */}
            {formik.touched.activityDate && formik.errors.activityDate && (
                <p className="text-xs text-red-500">{formik.errors.activityDate as string}</p>
            )}
          </div>

          {/* 2. Distance Input */}
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km) <span className="text-red-500">*</span></Label>
            <div className="relative">
                <Input 
                id="distance" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="Enter distance"
                {...formik.getFieldProps("distance")}
                className={formik.errors.distance && formik.touched.distance ? "border-red-500 pr-10" : "pr-10"}
                />
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* Thêm 'as string' */}
            {formik.touched.distance && formik.errors.distance && (
                <p className="text-xs text-red-500">{formik.errors.distance as string}</p>
            )}
          </div>

          {/* 3. Proof Image Input */}
          <div className="space-y-2">
            <Label htmlFor="proof">
                Proof Image <span className="text-red-500">*</span>
            </Label>
            
            <input 
              ref={fileInputRef}
              id="proof" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileChange} 
            />

            <div 
                className="flex items-center w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors overflow-hidden cursor-pointer hover:bg-slate-50"
                onClick={triggerFileInput}
            >
                <div className="bg-slate-200 px-4 py-2 text-slate-700 font-medium border-r border-slate-300 hover:bg-slate-300 transition-colors">
                    Choose File
                </div>
                <div className="px-3 text-slate-500 italic truncate flex-1">
                    {formik.values.imageFile ? formik.values.imageFile.name : "No new file chosen"}
                </div>
            </div>

            <div className="mt-3">
                {(previewUrl || activity.proofImage) ? (
                    <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                        <img 
                            src={previewUrl || activity.proofImage} 
                            alt="Proof Preview" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                            {previewUrl ? "New Image Selected" : "Current Image"}
                        </div>
                        {previewUrl && (
                             <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 left-2 h-6 w-6 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeNewFile();
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic">No image uploaded</div>
                )}
                <p className="text-[11px] text-muted-foreground mt-1.5">
                    Upload an image as proof of your activity. If you don't choose a new file, the current image will be kept.
                </p>
            </div>
        </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}