import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Loader2, Clock, Target } from "lucide-react"; // 👈 Thêm icon Target
import type { Campaign } from "@/types/campaign";
import { useUpdateCampaign } from "@/hooks/useCampaigns";
import toast from "react-hot-toast";

interface EditCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export default function EditCampaignModal({ campaign, onClose }: EditCampaignModalProps) {
  const updateMutation = useUpdateCampaign();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(campaign.imageUrl || "");

  const [formData, setFormData] = useState({
    name: campaign.name,
    description: campaign.description,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    startTime: campaign.startTime ? campaign.startTime.substring(0, 5) : "09:00",
    endTime: campaign.endTime ? campaign.endTime.substring(0, 5) : "17:00",
    targetGoal: campaign.targetGoal || 100, // 👈 THÊM: Init state
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const currentImageUrl = (!imageFile && !previewUrl) ? "" : campaign.imageUrl;

      const campaignData: Partial<Campaign> = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime + ":00",
        endTime: formData.endTime + ":00",
        targetGoal: Number(formData.targetGoal), // 👈 THÊM: Gửi lên payload
        activityType: campaign.activityType,
        imageUrl: currentImageUrl, 
        status: campaign.status
      };

      await updateMutation.mutateAsync({
        id: campaign.id,
        data: campaignData,
        imageFile: imageFile || undefined
      });
      
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  // Helper hiển thị unit
  const unit = ['walking', 'running', 'cycling'].includes(campaign.activityType || '') ? 'km' : 'pts';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-semibold">Edit Campaign</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Upload Section - Giữ nguyên */}
          <div className="space-y-2">
             {/* ... Code upload ảnh cũ ... */}
             <label className="text-sm font-medium">Campaign Image</label>
             <div className="flex justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {previewUrl ? (
                    <div className="relative w-full">
                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={removeImage}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="text-center cursor-pointer py-8 w-full hover:bg-muted/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload new image</p>
                    </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
             </div>
          </div>

          {/* --- Basic Info --- */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Campaign Name</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
          </div>

          {/* 👇 THÊM: Input Target Goal */}
          <div className="space-y-2">
            <label htmlFor="targetGoal" className="text-sm font-medium flex items-center gap-1">
                <Target className="w-3 h-3" /> Target Goal
            </label>
            <div className="relative">
                <Input 
                    id="targetGoal" 
                    name="targetGoal" 
                    type="number" 
                    value={formData.targetGoal} 
                    onChange={handleChange} 
                    min={1}
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">
                    {unit}
                </span>
            </div>
          </div>

          {/* --- Date & Time Section --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Start Time
              </label>
              <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> End Time
              </label>
              <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}