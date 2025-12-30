import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitActivity } from "@/hooks/useCampaigns";
import { useFormik } from "formik";
import { Calendar, Loader2, MapPin, Upload, X } from "lucide-react"; // ❌ Đã xóa Clock icon
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

interface SubmitActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
}

export default function SubmitActivityDialog({
  open,
  onOpenChange,
  campaign,
}: SubmitActivityDialogProps) {
  const submitMutation = useSubmitActivity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const validationSchema = Yup.object({
    activityDate: Yup.date()
      .required("Activity date is required")
      .min(
        new Date(campaign?.startDate),
        `Date must be after ${new Date(campaign?.startDate).toLocaleDateString()}`
      )
      .max(
        new Date(campaign?.endDate),
        `Date must be before ${new Date(campaign?.endDate).toLocaleDateString()}`
      )
      .max(new Date(), "Cannot submit future activities"),
    distance: Yup.number()
      .required("Distance is required")
      .positive("Distance must be positive")
      .typeError("Must be a number"),
    imageFile: Yup.mixed().required("Proof image is required"),
  });

  const formik = useFormik({
    initialValues: {
      activityDate: new Date().toISOString().split("T")[0],
      distance: "",
      imageFile: null as File | null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!campaign || !values.imageFile) return;

      try {
        await submitMutation.mutateAsync({
          campaignId: campaign.id,
          activityDate: values.activityDate,
          distance: Number(values.distance),
          imageFile: values.imageFile,
        });

        toast.success("Activity submitted successfully! Pending approval.");
        handleClose();
      } catch (error: any) {
        const msg = error?.response?.data || "Failed to submit activity.";
        toast.error(msg);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("imageFile", file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("imageFile", null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    formik.resetForm();
    setPreviewUrl("");
    onOpenChange(false);
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit New Results</DialogTitle>
          <DialogDescription>
            {campaign.name} • {new Date(campaign.startDate).toLocaleDateString()} -{" "}
            {new Date(campaign.endDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
          
          {/* 1. Activity Date */}
          <div className="space-y-2">
            <Label htmlFor="activityDate">Activity Date *</Label>
            <div className="relative">
              <Input
                id="activityDate"
                type="date"
                {...formik.getFieldProps("activityDate")}
                className={formik.errors.activityDate && formik.touched.activityDate ? "border-red-500" : ""}
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {formik.touched.activityDate && formik.errors.activityDate && (
              <p className="text-xs text-red-500">{formik.errors.activityDate}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be within campaign duration.
            </p>
          </div>
          
            {/* 2. Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km) *</Label>
            <div className="relative">
              <Input
                id="distance"
                placeholder="Enter distance (e.g. 5.2)"
                type="number"
                step="0.01"
                {...formik.getFieldProps("distance")}
                className={formik.errors.distance && formik.touched.distance ? "border-red-500" : ""}
              />
              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {formik.touched.distance && formik.errors.distance && (
              <p className="text-xs text-red-500">{formik.errors.distance}</p>
            )}
          </div>

          {/* 3. Proof Image */}
          <div className="space-y-2">
            <Label>Proof Image *</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Proof"
                    className="max-h-48 mx-auto rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="cursor-pointer py-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload proof image
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {formik.touched.imageFile && formik.errors.imageFile && (
              <p className="text-xs text-red-500">{formik.errors.imageFile}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}