import CampaignList from '@/components/campaigns/CampaignList';
import { Card, CardContent } from '@/components/ui/card';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '@/types/campaign';
import LeaderboardView from '@/components/campaigns/LeaderboardView';
import { useState } from 'react';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading, error } = useCampaigns();

  const [leaderboardCampaign, setLeaderboardCampaign] = useState<Campaign | null>(null);

  const handleCreateCampaign = () => {
    navigate('/admin/campaigns/new');
  };

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/admin/campaigns/${campaign.id}`);
  };

  const handleViewFinalRankings = (campaign: Campaign) => {
    navigate(`/admin/campaigns/${campaign.id}/leaderboard`);
  };

  const handleViewLeaderboard = (campaign: Campaign) => {
    setLeaderboardCampaign(campaign);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewApprovals = () => {
    navigate('/admin/campaigns/approvals');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">
              Failed to load campaigns
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboardCampaign) {
    return (
      <div className="max-w-5xl mx-auto">
        <LeaderboardView 
          campaign={leaderboardCampaign}
          onBack={() => setLeaderboardCampaign(null)} // Nút back sẽ set null để quay lại list
          isAdminView={true} // 👈 Quan trọng: Bật chế độ Admin để ẩn phần "Your Rank"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CampaignList
        campaigns={campaigns || []}
        onCreateCampaign={handleCreateCampaign}
        onViewCampaign={handleViewCampaign}
        onViewFinalRankings={handleViewLeaderboard}
        onViewApprovals={handleViewApprovals}
      />
    </div>
  );
}