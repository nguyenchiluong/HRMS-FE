import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// IMPORT MỚI: hooks
import { useMyCampaignActivities, useDeleteActivity } from "@/hooks/useCampaigns";
import { ArrowLeft, CheckCircle2, Clock, Edit, Loader2, Trash2, X, XCircle } from "lucide-react";
import { useState } from "react";
// IMPORT MỚI: EditModal và Alert Dialog
import EditActivityModal from "./EditActivityModal";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { EmployeeActivity } from "@/types/campaign";

interface SubmissionHistoryViewProps {
  campaign: any;
  onBack: () => void;
}

export default function SubmissionHistoryView({ campaign, onBack }: SubmissionHistoryViewProps) {
  const { data: submissions = [], isLoading, error } = useMyCampaignActivities(campaign.id);
  const deleteMutation = useDeleteActivity(); // Hook xóa

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  // State quản lý việc sửa
  const [editingActivity, setEditingActivity] = useState<EmployeeActivity | null>(null);

  const getMetrics = (jsonString: string) => {
    try {
      if (!jsonString) return { distance: 0 };
      return JSON.parse(jsonString);
    } catch (e) {
      return { distance: 0 };
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  };

  // 👇 Hàm xử lý xóa thật
  const handleDelete = async (id: string | number) => {
    try {
        await deleteMutation.mutateAsync(id);
    } catch (error: any) {
    }
  };

  const total = submissions.length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  
  const distanceTotal = submissions
    .filter(s => s.status === 'approved')
    .reduce((acc, curr) => {
        const metrics = getMetrics(curr.metrics);
        return acc + (Number(metrics.distance) || 0);
    }, 0);

  if (isLoading) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
      return (
          <div className="text-center py-10 text-red-500">
              Failed to load history. Please try again later.
          </div>
      )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & STATS (Giữ nguyên) */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="h-10 w-10 rounded-full border-slate-300">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{campaign.name}</h2>
            <p className="text-slate-500 text-sm">Submission History & Progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance (Approved)</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{distanceTotal.toFixed(2)} km</div>
                <p className="text-xs text-muted-foreground">Recorded from approved activities</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <Clock className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-xs text-muted-foreground">{approved} approved, {total - approved} pending/rejected</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaign Status</CardTitle>
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status || 'Active'}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium mt-2">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* MAIN TABLE */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[180px]">Activity Date</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((item) => {
                const metrics = getMetrics(item.metrics);
                return (
                    <TableRow key={item.activityId}>
                        <TableCell className="font-medium">
                            {new Date(item.activityDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                            <span className="font-bold text-slate-900">{metrics.distance} km</span>
                        </TableCell>
                        <TableCell>
                            <div 
                                className="relative w-12 h-12 rounded overflow-hidden cursor-pointer border border-slate-200 hover:ring-2 hover:ring-blue-400 transition-all"
                                onClick={() => setZoomedImage(item.proofImage)}
                            >
                                <img 
                                  src={item.proofImage || "https://placehold.co/100?text=No+Img"} 
                                  alt="proof"
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                            {formatDateTime(item.createdAt)} 
                        </TableCell>
                        <TableCell>
                            {item.status === 'pending' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>}
                            {item.status === 'approved' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Approved</Badge>}
                            {item.status === 'rejected' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>}
                            
                            {/* Hiển thị lý do từ chối nếu có */}
                            {item.status === 'rejected' && item.rejectionReason && (
                                <p className="text-[10px] text-red-600 mt-1 max-w-[150px] leading-tight">Reason: {item.rejectionReason}</p>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            {/* CASE 1: PENDING - Cho phép Edit / Delete */}
                            {item.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                    {/* Edit Button */}
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => setEditingActivity(item)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>

                                    {/* Delete Button with Confirmation */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                                                {deleteMutation.isPending && deleteMutation.variables === item.activityId ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This pending submission will be permanently removed.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={() => handleDelete(item.activityId)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}

                            {/* CASE 2: REJECTED - (Tạm thời chưa xử lý edit resubmit, có thể ẩn hoặc để nút disabled) */}
                        </TableCell>
                    </TableRow>
                )
            })}
            
            {!isLoading && submissions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <Clock className="w-8 h-8 text-slate-300" />
                           <p>No activities submitted yet.</p>
                           <p className="text-xs text-slate-400">Join the campaign and submit your first result!</p>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG ZOOM ẢNH */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none shadow-none flex justify-center items-center">
           <div className="relative">
              {zoomedImage && (
                <img 
                  src={zoomedImage} 
                  alt="Full Proof" 
                  className="max-w-[90vw] max-h-[85vh] rounded-md shadow-2xl border-2 border-white/20 bg-black"
                />
              )}
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute -top-10 right-0 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={() => setZoomedImage(null)}
              >
                <X className="w-5 h-5" />
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* MODAL EDIT - Thêm vào cuối */}
      {editingActivity && (
        <EditActivityModal 
            activity={editingActivity}
            campaign={campaign}
            onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}