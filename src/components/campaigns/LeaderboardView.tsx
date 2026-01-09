import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaignLeaderboard, useMyRank } from "@/hooks/useCampaigns";
import { Campaign } from "@/types/campaign";
import { ArrowLeft, TrendingUp, Trophy, Zap, Medal, Crown, Building2, IdCard, Target, Flag, Users } from "lucide-react";

interface LeaderboardViewProps {
  campaign: Campaign;
  onBack: () => void;
  isAdminView?: boolean;
}

export default function LeaderboardView({ campaign, onBack, isAdminView = false }: LeaderboardViewProps) {
  const { data: leaderboard = [], isLoading: loadingBoard } = useCampaignLeaderboard(campaign.id);
  const { data: myRank, isLoading: loadingRank } = useMyRank(campaign.id, !isAdminView);

  const targetGoal = campaign.targetGoal || 100;
  // Xác định xem đây có phải là Final Leaderboard không
  const isFinalLeaderboard = campaign.status === 'completed' ;
  const unit = campaign.primaryMetric?.includes('Distance') ? 'km' : 'pts';

  // --- LOGIC TÍNH TỔNG KẾT (Chỉ dùng cho Final) ---
  // 1. Tính tổng thành tích của tất cả nhân viên
  const grandTotalDistance = leaderboard.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0);
  
  // 2. Tính % hoàn thành của cả tập thể so với Target
  const collectivePercent = (grandTotalDistance / targetGoal) * 100;
  const isCollectiveGoalReached = collectivePercent >= 100;

  // --- Render Helpers (Giữ nguyên) ---
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 bg-yellow-100 rounded-full border-2 border-yellow-400 shadow-sm flex items-center justify-center">
              <Trophy className="h-7 w-7 text-yellow-600 fill-yellow-400" />
            </div>
            <div className="absolute -top-2 text-yellow-500 animate-bounce-slow">
              <Crown className="h-5 w-5 fill-yellow-400" />
            </div>
            <div className="absolute -bottom-1 bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
              1st
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative flex h-12 w-12 items-center justify-center">
             <div className="absolute inset-0 bg-slate-100 rounded-full border-2 border-slate-300 shadow-sm flex items-center justify-center">
               <Medal className="h-6 w-6 text-slate-500 fill-slate-300" />
            </div>
            <div className="absolute -bottom-1 bg-slate-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
               2nd
            </div>
          </div>
        );
      case 3:
        return (
          <div className="relative flex h-12 w-12 items-center justify-center">
             <div className="absolute inset-0 bg-orange-100 rounded-full border-2 border-orange-300 shadow-sm flex items-center justify-center">
               <Medal className="h-6 w-6 text-orange-600 fill-orange-300" />
            </div>
            <div className="absolute -bottom-1 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
               3rd
            </div>
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 font-bold border border-slate-200 shadow-sm">
            {rank}
          </div>
        );
    }
  };

  const getRowStyle = (rank: number, isMe: boolean) => {
      if (isMe) return "ring-2 ring-blue-500 bg-blue-50/50 z-10";
      switch (rank) {
          case 1: return "bg-gradient-to-r from-yellow-50 to-white border-yellow-200 shadow-sm"; 
          case 2: return "bg-gradient-to-r from-slate-50 to-white border-slate-200";   
          case 3: return "bg-gradient-to-r from-orange-50 to-white border-orange-200"; 
          default: return "bg-white border-slate-100 hover:border-blue-200";
      }
  };

  if (loadingBoard) return <div className="p-10 flex justify-center"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="icon" onClick={onBack} className="h-10 w-10 rounded-full border-slate-300 shrink-0">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">
                {isFinalLeaderboard ? "Final Leaderboard" : "Leaderboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
             <span className="font-medium text-slate-700">{campaign.name}</span>
             <span className="text-slate-300">•</span>
             <Badge variant={isFinalLeaderboard ? "default" : "outline"} className={`gap-1 px-2 py-0 h-5 ${isFinalLeaderboard ? "bg-slate-800" : "text-green-600 bg-green-50 border-green-200"}`}>
                {isFinalLeaderboard ? "Closed" : "Active"}
             </Badge>
          </div>
        </div>
      </div>

      {/* 👇 PHẦN MỚI: CAMPAIGN FINAL REPORT 
          Chỉ hiển thị khi isFinalLeaderboard = true 
      */}
      {isFinalLeaderboard && (
        <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-100">
                    <Flag className="w-5 h-5" /> Campaign Final Report
                </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10">
                {/* 1. Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Tổng kết quả */}
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Total {unit === 'km' ? 'Distance' : 'Points'}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">{Number(grandTotalDistance.toFixed(1))}</span>
                            <span className="text-sm text-slate-400">{unit}</span>
                        </div>
                    </div>

                    {/* Mục tiêu */}
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Campaign Target</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-slate-200">{targetGoal}</span>
                            <span className="text-sm text-slate-400">{unit}</span>
                        </div>
                    </div>

                    {/* Tổng người tham gia */}
                    <div className="hidden md:block">
                        <p className="text-sm text-slate-400 mb-1">Total Participants</p>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-3xl font-bold text-white">{leaderboard.length}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Progress Bar của Tập thể */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className={`font-semibold ${isCollectiveGoalReached ? 'text-green-400' : 'text-blue-300'}`}>
                            {isCollectiveGoalReached ? "Target Surpassed!" : "Completion Rate"}
                        </span>
                        <span className="font-bold text-white">{Math.round(collectivePercent)}%</span>
                    </div>
                    
                    {/* Custom Progress Bar màu đẹp hơn */}
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div 
                            className={`h-full transition-all duration-1000 ${
                                isCollectiveGoalReached 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-400'
                            }`}
                            style={{ width: `${Math.min(100, collectivePercent)}%` }}
                        />
                    </div>
                    
                    <p className="text-xs text-slate-400 text-right">
                        Combined effort of all {leaderboard.length} participants
                    </p>
                </div>
            </CardContent>
        </Card>
      )}

      {/* --- SECTION 1: MY RANK (Chỉ hiện cho Employee VÀ khi KHÔNG phải là Final View để tránh lặp) --- */}
      {/* Logic: Khi Final thì xem Report chung quan trọng hơn, hoặc có thể hiện cả 2 tùy bạn. Ở đây tôi để hiện cả 2 */}
      {!isAdminView && myRank && (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-none text-white shadow-lg relative overflow-hidden transform hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="shrink-0">
                         {myRank.rank > 0 && myRank.rank <= 3 ? (
                             <div className="scale-110 drop-shadow-md">
                                 {getRankBadge(myRank.rank)}
                             </div>
                         ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl font-bold border border-white/30 shadow-inner">
                                #{myRank.rank > 0 ? myRank.rank : '-'}
                            </div>
                         )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-blue-50">
                            {isFinalLeaderboard ? "Your Final Result" : "Your Performance"}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold">{myRank.totalPoints}</span>
                            <span className="text-blue-200 text-sm">{unit}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 border-none">
                                {Math.floor((myRank.totalPoints / (isFinalLeaderboard ? 1 : targetGoal)) * 100)}% Contribution
                            </Badge>
                            <span className="text-xs text-blue-200 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> {myRank.completedActivities} activities
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {/* --- SECTION 2: LEADERBOARD LIST --- */}
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No rankings yet. Be the first to join!</p>
            </div>
        ) : (
            leaderboard.map((entry) => {
                const isMe = !isAdminView && entry.rank === myRank?.rank;
                const initial = entry.employeeName ? entry.employeeName.charAt(0).toUpperCase() : "?";
                
                return (
                    <Card 
                        key={entry.employeeId} 
                        className={`transition-all border shadow-sm ${getRowStyle(entry.rank, isMe || false)}`}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            {/* Cột 1: Rank Badge */}
                            <div className="shrink-0 w-14 flex justify-center">
                                {getRankBadge(entry.rank)}
                            </div>

                            {/* Cột 2: User Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className={`h-10 w-10 border ${isMe ? 'border-blue-200' : 'border-slate-100'}`}>
                                    <AvatarFallback className={`${isMe ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'} font-bold`}>
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="truncate flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-bold truncate ${isMe ? 'text-blue-700' : 'text-slate-800'}`}>
                                            {isMe ? 'You' : entry.employeeName}
                                        </p>
                                        {isMe && <Badge className="bg-blue-600 hover:bg-blue-600 h-5 px-1.5 text-[10px]">You</Badge>}
                                        {entry.rank === 1 && <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 h-5 text-[10px] border-yellow-200">Leader</Badge>}
                                    </div>

                                    {/* Sub-info */}
                                    {isAdminView ? (
                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                            <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200" title="Employee ID">
                                                <IdCard className="w-3 h-3 text-slate-400" />
                                                <span className="font-mono font-medium">{entry.employeeId}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-600 font-medium truncate" title="Department">
                                                <Building2 className="w-3 h-3 text-slate-400" />
                                                <span className="truncate max-w-[150px]">
                                                    {entry.department || "Unknown Dept"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Zap className="w-3 h-3 text-slate-400" /> 
                                            {entry.completedActivities} activities completed
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Cột 3: Points/Distance */}
                            <div className="text-right shrink-0">
                                <p className={`text-xl font-bold ${entry.rank <= 3 ? 'text-slate-900 scale-110' : 'text-slate-700'}`}>
                                    {entry.totalPoints}
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase ml-1 align-top relative top-1">
                                        {unit}
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })
        )}
      </div>
    </div>
  );
}