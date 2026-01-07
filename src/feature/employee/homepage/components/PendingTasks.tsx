import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import { Link } from 'react-router-dom';

interface ActiveCampaignsProps {
  campaigns?: Campaign[];
  isLoading?: boolean;
}

export default function ActiveCampaigns({
  campaigns = [],
  isLoading = false,
}: ActiveCampaignsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
        <CardDescription>Campaigns you can join</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active campaigns available</p>
          ) : (
            campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.activityType} • Ends: {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/employee/campaigns">View</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
