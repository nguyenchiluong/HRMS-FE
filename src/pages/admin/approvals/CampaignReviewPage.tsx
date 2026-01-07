import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import thêm AlertDialog
import { Check, ChevronLeft, X, ZoomIn, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RejectDialog from "@/components/campaigns/RejectDialog";
import { usePendingActivities, useApproveActivity, useRejectActivity } from "@/hooks/useApprovals"; 
import { useCampaignDetail } from "@/hooks/useCampaigns"; 

export default function CampaignReviewPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  
  // 1. Fetch dữ liệu
  const { data: submissions, isLoading: isLoadingSubmissions } = usePendingActivities(campaignId || "");
  const { data: campaignData, isLoading: isLoadingCampaign } = useCampaignDetail(campaignId || "");

  // 2. Mutations
  const approveMutation = useApproveActivity();
  const rejectMutation = useRejectActivity();

  // State local UI
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null); // 👈 State mới cho Approve Popup
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const getDistance = (jsonString: string) => {
    try {
      if(!jsonString) return 0;
      const parsed = JSON.parse(jsonString);
      return parsed.distance || 0;
    } catch {
      return 0;
    }
  };

  // 👇 Hàm này giờ chỉ mở popup
  const handleClickApprove = (id: number) => {
    setApprovingId(id);
  };

  // 👇 Hàm xác nhận duyệt thật sự
  const handleConfirmApprove = () => {
    if (!approvingId) return;
    
    approveMutation.mutate(approvingId, {
      onSuccess: () => {
        toast.success("Submission approved successfully!");
        setApprovingId(null); // Đóng popup
      },
      onError: () => toast.error("Failed to approve submission"),
    });
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingId) return;
    rejectMutation.mutate({ id: rejectingId, reason }, {
        onSuccess: () => {
            toast.success("Submission rejected.");
            setRejectingId(null);
        },
        onError: () => toast.error("Failed to reject submission"),
    });
  };

  if (isLoadingSubmissions || isLoadingCampaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start gap-3">
            <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-900 mb-2" onClick={() => navigate('/admin/campaigns/approvals')}>
                <ChevronLeft className="w-4 h-4 mr-1" /> 
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {campaignData?.name || "Unknown Campaign"}
                </h1>
                <p className="text-slate-500">Review and approve employee submissions</p>
            </div>
        </div>

        <div className="h-4"></div>

        <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Submissions ({submissions?.length || 0})</h2>

        {/* LIST SUBMISSIONS */}
        <div className="space-y-6">
            {!submissions || submissions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 bg-white rounded-xl border border-dashed shadow-sm">
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm">No pending submissions left for this campaign.</p>
                </div>
            ) : (
                submissions.map((item) => {
                    const distance = getDistance(item.metrics);
                    
                    return (
                        <Card key={item.id} className="p-6 border-slate-200 shadow-sm bg-white">
                            
                            {/* 1. USER INFO */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900">{item.employeeName}</h3>
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-xs font-semibold">
                                        Pending
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500">{item.employeeEmail}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Submitted on {new Date(item.submittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            {/* 2. METRICS BAR */}
                            <div className="bg-slate-50 rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Distance</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900 tracking-tight">{distance}</span>
                                        <span className="text-base font-medium text-slate-500">km</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Activity Date</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-900 leading-none">
                                                {new Date(item.activityDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(item.activityDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. PROOF EVIDENCE */}
                            <div className="mb-2">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">Proof Evidence</p>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {item.proofImage ? (
                                        <div 
                                            className="relative w-32 h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group bg-slate-100 flex-shrink-0"
                                            onClick={() => setZoomedImage(item.proofImage)}
                                        >
                                            <img src={item.proofImage} alt="Proof" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-sm transition-opacity" />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No image</p>
                                    )}
                                </div>
                            </div>

                            {/* 4. ACTION BUTTONS */}
                            <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-4"
                                    onClick={() => setRejectingId(item.id)}
                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                >
                                    Reject
                                </Button>
                                <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm px-6"
                                    // 👇 Gọi hàm mở popup thay vì duyệt ngay
                                    onClick={() => handleClickApprove(item.id)}
                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                >
                                    {approveMutation.isPending && approveMutation.variables === item.id ? (
                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin"/>
                                    ) : (
                                        <Check className="w-4 h-4 mr-1.5" />
                                    )}
                                    Approve
                                </Button>
                            </div>

                        </Card>
                    );
                })
            )}
        </div>

        {/* DIALOGS */}
        
        {/* 1. REJECT DIALOG (Có sẵn) */}
        <RejectDialog 
            open={!!rejectingId} 
            onOpenChange={(open) => !open && setRejectingId(null)} 
            onConfirm={handleConfirmReject}
        />

        {/* 2. 👇 APPROVE CONFIRMATION DIALOG (MỚI) */}
        <AlertDialog open={!!approvingId} onOpenChange={(open) => !open && setApprovingId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Approve Submission?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will verify the activity and add the distance to the employee's total progress. 
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirmApprove}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Approve"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* 3. IMAGE ZOOM DIALOG */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
                {zoomedImage && (
                    <div className="relative">
                         <img 
                            src={zoomedImage} 
                            alt="Full Proof" 
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white/20" 
                        />
                        <Button 
                            variant="secondary" size="icon" 
                            className="absolute -top-4 -right-4 rounded-full shadow-md"
                            onClick={() => setZoomedImage(null)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
        
      </div>
    </div>
  );
}