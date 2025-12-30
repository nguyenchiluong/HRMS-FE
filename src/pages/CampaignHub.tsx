import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SubmitActivityDialog from "@/components/campaigns/SubmitActivityDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useActiveCampaigns, useMyCampaigns, useRegisterCampaign } from "@/hooks/useCampaigns";
import { Calendar, CheckCircle2, History, Info, Loader2, LogOut, Trophy, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// 👇 Import component View mới
import SubmissionHistoryView from "@/components/campaigns/SubmissionHistoryView";

export default function EmployeeCampaignHub() {
  const { data: activeCampaignsData, isLoading: loadingActive } = useActiveCampaigns();
  const { data: myCampaignsData, isLoading: loadingMy } = useMyCampaigns();

  const [submissionCampaign, setSubmissionCampaign] = useState<any | null>(null);
  const registerMutation = useRegisterCampaign();
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // 👇 State này giờ dùng để switch view (không phải bật popup nữa)
  const [historyCampaign, setHistoryCampaign] = useState<any | null>(null);

  const myCampaigns = myCampaignsData || [];
  const joinedIds = myCampaigns.map((c) => c.id);
  const activeCampaignsList = (activeCampaignsData || []).filter((c) => !joinedIds.includes(c.id));

  const handleConfirmRegister = async () => {
    if (!selectedCampaign) return;
    try {
      setIsRegistering(true);
      await registerMutation.mutateAsync(selectedCampaign.id);
      toast.success("Successfully registered!");
      setSelectedCampaign(null);
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to register.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleViewSubmissions = (campaign: any) => {
    setHistoryCampaign(campaign); // Chuyển sang mode xem lịch sử
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
  };

  const handleLeaveCampaign = (campaignId: string) => {
    toast.error("Leave Campaign API is not implemented yet in Backend.");
  };

  const handleOpenSubmitActivity = (campaign: any) => {
    setSubmissionCampaign(campaign);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loadingActive || loadingMy) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 👇 LOGIC QUAN TRỌNG: Nếu đang xem lịch sử, return giao diện lịch sử
  if (historyCampaign) {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <SubmissionHistoryView 
                    campaign={historyCampaign} 
                    onBack={() => setHistoryCampaign(null)} // Nút Back sẽ set null để quay lại Hub
                />
            </div>
        </div>
    );
  }

  // 👇 Nếu không, return giao diện Hub bình thường
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Campaigns Hub</h1>
          <p className="text-slate-500">
            Join campaigns, track your participation, and view your achievements
          </p>
        </div>

        {/* SECTION 1: Campaigns You Can Join */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Campaigns You Can Join</h2>
            <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
              {activeCampaignsList.length} available
            </Badge>
          </div>

          {activeCampaignsList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <p className="text-slate-500">No active campaigns available to join at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeCampaignsList.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="h-40 w-full relative bg-slate-100">
                    <img 
                      src={campaign.imageUrl || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=300&fit=crop"} 
                      alt={campaign.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm">
                        {campaign.activityType ? campaign.activityType.toUpperCase() : 'EVENT'}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{campaign.name}</h3>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">{campaign.description}</p>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      Register Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator className="my-8" />

        {/* SECTION 2: My Active Campaigns */}
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Active Campaigns</h2>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Joined: {myCampaigns.length}
                </Badge>
            </div>
            
            {myCampaigns.length === 0 ? (
                 <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Trophy className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">You haven't joined any campaigns yet</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Register for a campaign above!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="flex flex-col md:flex-row overflow-hidden border-slate-200 shadow-sm">
                            <div className="w-full md:w-64 h-auto relative min-h-[200px]">
                                  <img 
                                    src={campaign.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop"} 
                                    alt={campaign.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">{campaign.name}</h3>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> JOINED
                                        </Badge>
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            {campaign.activityType ? campaign.activityType.toUpperCase() : 'EVENT'}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-6">{campaign.description}</p>
                                    
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-700">Campaign Progress</span>
                                            <span className="font-bold text-slate-900">0%</span>
                                        </div>
                                        <Progress value={0} className="h-2 bg-slate-100" />
                                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                                            <span>0 points</span>
                                            <span>Start: {new Date(campaign.startDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex gap-3">
                                        <Button 
                                          className="flex-1 bg-slate-900 hover:bg-slate-800"
                                          onClick={() => handleOpenSubmitActivity(campaign)}
                                        >
                                            Submit Activity
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                                            <Trophy className="w-4 h-4 mr-2" />
                                            View Leaderboard
                                        </Button>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 bg-white"
                                            onClick={() => handleViewSubmissions(campaign)}
                                        >
                                            <History className="w-4 h-4 mr-2 text-slate-500" />
                                            View Submissions
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                            onClick={() => handleLeaveCampaign(campaign.id)}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Leave Campaign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>

        {/* DIALOG 1: REGISTER CAMPAIGN */}
        <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Register for Campaign</DialogTitle>
              <DialogDescription>
                Review the campaign details and confirm your registration.
              </DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <div className="py-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedCampaign.name}</h3>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                        {selectedCampaign.activityType ? selectedCampaign.activityType.toUpperCase() : 'EVENT'}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">{selectedCampaign.description}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">Duration</p>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(selectedCampaign.startDate)} - {formatDate(selectedCampaign.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                     <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">Current Participants</p>
                        <p className="text-sm font-medium text-slate-900">Open for all employees</p>
                     </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Note: </span>
                    You can join multiple active campaigns at the same time.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button variant="outline" onClick={() => setSelectedCampaign(null)} disabled={isRegistering}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmRegister} disabled={isRegistering}>
                {isRegistering ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Confirm Registration"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG 2: SUBMIT ACTIVITY */}
        {submissionCampaign && (
          <SubmitActivityDialog 
            open={!!submissionCampaign} 
            onOpenChange={(open) => !open && setSubmissionCampaign(null)}
            campaign={submissionCampaign}
          />
        )}

      </div>
    </div>
  );
}