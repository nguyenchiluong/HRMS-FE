import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignList from "@/components/campaigns/CampaignList";
import { useCampaigns } from '@/hooks/useCampaigns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading, error } = useCampaigns();

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleViewCampaign = (campaign: any) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleViewFinalRankings = (campaign: any) => {
    navigate(`/campaigns/${campaign.id}/results`);
  };

  const handleViewApprovals = () => {
    navigate('/campaigns/approvals');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
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
            <p className="text-sm text-muted-foreground mt-2">
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