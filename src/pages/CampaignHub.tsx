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
import { useActiveCampaigns, useMyCampaigns, useRegisterCampaign, useMyRank } from "@/hooks/useCampaigns"; // 👈 Import useMyRank
import { Calendar, CheckCircle2, History, Info, Loader2, LogOut, Trophy, Users, Star } from "lucide-react";
import { useState } from "react";
import LeaderboardView from "@/components/campaigns/LeaderboardView";
import toast from "react-hot-toast";

// Import component View mới
import SubmissionHistoryView from "@/components/campaigns/SubmissionHistoryView";
import LeaveCampaignDialog from "@/components/campaigns/LeaveCampaignDialog";
import { Campaign } from "@/types/campaign";

// --- COMPONENT CON: PAST CAMPAIGN CARD ---
// Tách ra để gọi hook useMyRank cho từng card
const PastCampaignCard = ({ campaign, onViewLeaderboard }: { campaign: Campaign, onViewLeaderboard: (c: Campaign) => void }) => {
  // Lấy hạng của user trong chiến dịch này
  const { data: rankInfo, isLoading } = useMyRank(campaign.id, true);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-slate-200 hover:shadow-md transition-all">
      {/* LEFT SIDE: INFO */}
      <div className="flex-1 mb-4 sm:mb-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-slate-900">{campaign.name}</h3>
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-2.5 py-0.5 rounded-full font-medium">
            {campaign.activityType || 'General'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
          </div>
          
          {/* 👇 PHẦN HIỂN THỊ RANKED (ĐÃ SỬA) */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-700">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                rankInfo && rankInfo.rank > 0 ? `Ranked #${rankInfo.rank}` : `Not Ranked`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: BUTTON */}
      <Button
        className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-semibold border-none shadow-sm"
        onClick={() => onViewLeaderboard(campaign)}
      >
        View Final Ranking
      </Button>
    </Card>
  );
};

// --- COMPONENT CHÍNH ---
export default function EmployeeCampaignHub() {
  // Fetch Data
  const { data: activeCampaignsData, isLoading: loadingActive } = useActiveCampaigns();
  const { data: myCampaignsData, isLoading: loadingMy } = useMyCampaigns();

  // Local State
  const [submissionCampaign, setSubmissionCampaign] = useState<any | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [historyCampaign, setHistoryCampaign] = useState<any | null>(null);
  const [leavingCampaign, setLeavingCampaign] = useState<any | null>(null);
  const [leaderboardCampaign, setLeaderboardCampaign] = useState<any | null>(null);

  // Mutations
  const registerMutation = useRegisterCampaign();

  // --- LOGIC PHÂN LOẠI CAMPAIGN ---
  const myCampaigns = myCampaignsData || [];
  
  // 1. Chiến dịch ĐANG THAM GIA (Active)
  const myActiveCampaigns = myCampaigns.filter(c => c.status === 'active');
  
  // 2. Chiến dịch ĐÃ KẾT THÚC (Completed/Closed)
  const myPastCampaigns = myCampaigns.filter(c => c.status === 'completed');

  // 3. Chiến dịch CÓ THỂ JOIN
  const joinedIds = myCampaigns.map((c) => c.id);
  const activeCampaignsList = (activeCampaignsData || []).filter((c) => !joinedIds.includes(c.id));

  // --- HANDLERS ---
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
    setHistoryCampaign(campaign);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSubmitActivity = (campaign: any) => {
    setSubmissionCampaign(campaign);
  };

  const handleViewLeaderboard = (campaign: any) => {
    setLeaderboardCampaign(campaign);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- CONDITIONAL RENDERING: LOADING ---
  if (loadingActive || loadingMy) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- CONDITIONAL RENDERING: SUB-VIEWS ---
  if (leaderboardCampaign) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <LeaderboardView
            campaign={leaderboardCampaign}
            onBack={() => setLeaderboardCampaign(null)}
            isAdminView={false}
          />
        </div>
      </div>
    );
  }

  if (historyCampaign) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <SubmissionHistoryView 
            campaign={historyCampaign} 
            onBack={() => setHistoryCampaign(null)} 
          />
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Campaigns Hub</h1>
          <p className="text-slate-500">
            Join campaigns, track your participation, and view your achievements
          </p>
        </div>

        {/* SECTION 1: CAMPAIGNS YOU CAN JOIN */}
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
                        <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{campaign.participantCount || 0} participants</span>
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

        {/* SECTION 2: MY ACTIVE CAMPAIGNS */}
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Active Campaigns</h2>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Running: {myActiveCampaigns.length}
                </Badge>
            </div>
            
            {myActiveCampaigns.length === 0 ? (
                 <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Trophy className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">You haven't joined any active campaigns</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Register for a campaign above!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myActiveCampaigns.map((campaign) => (
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
                                            <span className="font-medium text-slate-700">Total Progress</span>
                                            <span className="font-bold text-slate-900">{campaign.totalDistance || 0} {campaign.primaryMetric?.includes('Distance') ? 'km' : 'pts'}</span>
                                        </div>
                                        <Progress value={30} className="h-2 bg-slate-100" />
                                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                                            <span>Current Result</span>
                                            <span>Ends: {formatDate(campaign.endDate)}</span>
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
                                        <Button variant="outline" 
                                              className="flex-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                                              onClick={() => handleViewLeaderboard(campaign)} 
                                        >
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
                                            onClick={() => setLeavingCampaign(campaign)}
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

        {/* SECTION 3: MY PAST CAMPAIGNS */}
        {myPastCampaigns.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">My Past Campaigns</h2>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</span>
              </div>

              <div className="flex flex-col gap-4">
                {myPastCampaigns.map((campaign) => (
                  // 👇 Sử dụng Component con để có thể gọi useMyRank cho từng card
                  <PastCampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onViewLeaderboard={handleViewLeaderboard} 
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* DIALOGS */}
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

        {submissionCampaign && (
          <SubmitActivityDialog 
            open={!!submissionCampaign} 
            onOpenChange={(open) => !open && setSubmissionCampaign(null)}
            campaign={submissionCampaign}
          />
        )}

        {leavingCampaign && (
          <LeaveCampaignDialog 
            open={!!leavingCampaign} 
            onOpenChange={(open) => !open && setLeavingCampaign(null)}
            campaign={leavingCampaign}
          />
        )}

      </div>
    </div>
  );
}