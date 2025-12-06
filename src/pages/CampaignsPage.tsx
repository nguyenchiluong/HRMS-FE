import CampaignList from '@/components/campaigns/CampaignList';
import { Card, CardContent } from '@/components/ui/card';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading, error } = useCampaigns();

  const handleCreateCampaign = () => {
    navigate('/admin/campaigns/new');
  };

  const handleViewCampaign = (campaign: any) => {
    navigate(`/admin/campaigns/${campaign.id}`);
  };

  const handleViewFinalRankings = (campaign: any) => {
    navigate(`/admin/campaigns/${campaign.id}/results`);
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
            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CampaignList
        campaigns={campaigns || []}
        onCreateCampaign={handleCreateCampaign}
        onViewCampaign={handleViewCampaign}
        onViewFinalRankings={handleViewFinalRankings}
        onViewApprovals={handleViewApprovals}
      />
    </div>
  );
}
