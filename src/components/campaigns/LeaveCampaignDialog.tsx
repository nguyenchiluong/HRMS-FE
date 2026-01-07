import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { useLeaveCampaign } from "@/hooks/useCampaigns";
  import { Campaign } from "@/types/campaign";
  import { AlertTriangle, Calendar, Loader2, Users } from "lucide-react";
  import toast from "react-hot-toast";
  
  interface LeaveCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign: Campaign;
  }
  
  export default function LeaveCampaignDialog({
    open,
    onOpenChange,
    campaign,
  }: LeaveCampaignDialogProps) {
    const leaveMutation = useLeaveCampaign();
  
    const handleLeave = async () => {
      try {
        await leaveMutation.mutateAsync(campaign.id);
        toast.success(`Successfully left "${campaign.name}"`);
        onOpenChange(false); // Đóng popup
      } catch (error: any) {
        // Lấy message lỗi từ Backend (VD: "Cannot leave closed campaign")
        const msg = error?.response?.data || "Failed to leave campaign.";
        toast.error(msg);
      }
    };
  
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white">
          
          {/* Header với Icon cảnh báo đỏ */}
          <div className="p-6 pb-2">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertTriangle className="h-5 w-5 fill-red-100" />
                <AlertDialogTitle className="text-lg font-bold text-slate-900">
                  Leave Campaign
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-500 text-sm">
                Are you sure you want to leave this campaign? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
  
          {/* Nội dung cảnh báo */}
          <div className="px-6 space-y-4 mb-6">
            
            {/* 1. Red Alert Box */}
            <div className="bg-red-50 border border-red-100 rounded-md p-3 flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                Leaving a campaign will permanently remove you from participation and cannot be reversed.
              </p>
            </div>
  
            {/* 2. Campaign Info Box (Gray) */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
              <h4 className="font-bold text-slate-900 mb-2">{campaign.name}</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  {/* Nếu có field participants thì dùng, tạm thời để text tĩnh */}
                  <span className="font-medium">
                    {campaign.participantCount ?? 0} participants
                  </span> 
                </div>
              </div>
            </div>
  
            {/* 3. Yellow Consequences Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
              <p className="font-bold text-amber-900 mb-2">What happens when you leave:</p>
              <ul className="list-disc pl-4 space-y-1 text-amber-800 marker:text-amber-500">
                <li>You will lose access to submit new activities for this campaign</li>
                <li>All your progress and activities in this campaign will be removed immediately</li>
                <li>You cannot rejoin this specific campaign</li>
              </ul>
            </div>
          </div>
  
          {/* Footer Buttons */}
          <AlertDialogFooter className="p-4 bg-slate-50 border-t border-slate-100 sm:justify-end gap-2">
            <AlertDialogCancel disabled={leaveMutation.isPending} className="bg-white border-slate-300 mt-0">
              Cancel
            </AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleLeave} 
              disabled={leaveMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {leaveMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Leaving...</>
              ) : (
                "Leave Campaign"
              )}
            </Button>
          </AlertDialogFooter>
  
        </AlertDialogContent>
      </AlertDialog>
    );
  }