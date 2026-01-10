import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Campaign } from '@/types/campaign';
import { Link } from 'react-router-dom';

interface MyCampaignsProps {
  campaigns?: Campaign[];
  isLoading?: boolean;
}

export default function MyCampaigns({
  campaigns = [],
  isLoading = false,
}: MyCampaignsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Campaigns</CardTitle>
        <CardDescription>Campaigns you've joined</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading your campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't joined any campaigns yet.{' '}
              <Link to="/employee/campaigns" className="text-primary hover:underline">
                Browse campaigns
              </Link>
            </p>
          ) : (
            campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{campaign.name}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      campaign.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : campaign.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {campaign.activityType} • Ends: {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
