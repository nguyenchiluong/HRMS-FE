import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ClipboardList, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePendingCampaigns } from "@/hooks/useApprovals"; 

export default function ApprovalsDashboard() {
  const navigate = useNavigate();
  
  const { data: campaigns, isLoading } = usePendingCampaigns();

  if (isLoading) {
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
             <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-900 mb-2" onClick={() => navigate('/admin/campaigns')}>
                <ChevronLeft className="w-4 h-4 mr-1" /> 
            </Button>

             <div>
                <h1 className="text-2xl font-bold text-slate-900">Approvals Dashboard</h1>
                <p className="text-slate-500">Overview of pending submissions across campaigns</p>
             </div>
        </div>

        {/* List Campaigns */}
        <div className="grid gap-4">
            {/* Kiểm tra mảng rỗng */}
            {!campaigns || campaigns.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed">
                    <p className="text-slate-500">No pending submissions found.</p>
                </div>
            ) : (
                campaigns.map((campaign) => (
                    <Card 
                        key={campaign.id} 
                        className="p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-slate-200 group bg-white"
                        onClick={() => navigate(`/admin/campaigns/approvals/${campaign.id}`)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                    {campaign.name}
                                </h3>
                                <p className="text-sm text-slate-400">Click to review submissions</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none px-3 py-1 text-xs font-bold rounded-full">
                                {campaign.pendingCount} pending
                            </Badge>
                            
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Card>
                ))
            )}
        </div>

      </div>
    </div>
  );
}