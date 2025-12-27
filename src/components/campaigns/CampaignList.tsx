import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Campaign, CampaignListItem } from '@/types/campaign';
import { CheckCircle, Edit2, Eye, Plus, Trophy } from 'lucide-react';
import { useState } from 'react';
import EditCampaignModal from './EditCampaignModal';

interface CampaignListProps {
  campaigns: Campaign[];
  onCreateCampaign: () => void;
  onViewCampaign: (campaign: Campaign) => void;
  onViewFinalRankings: (campaign: Campaign) => void;
  onViewApprovals: () => void;
}

// Mock images
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop',
];

// DI CHUYỂN CÁC HÀM LÊN TRÊN - TRƯỚC KHI ĐƯỢC SỬ DỤNG
const getPrimaryMetric = (activityType: string) => {
  switch (activityType) {
    case 'walking':
    case 'running':
      return 'Distance (km)';
    case 'cycling':
      return 'Distance (km)';
    default:
      return 'Points';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'completed':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'draft':
      return 'Draft';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

/*export interface CampaignListItem extends Campaign {
  primaryMetric: string;
  participants: number;
  totalDistance: number;
  pendingSubmissions: number;
  image: string;
}*/

export default function CampaignList({
  campaigns,
  onCreateCampaign,
  onViewCampaign,
  onViewFinalRankings,
  onViewApprovals,
}: CampaignListProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // BÂY GIỜ getPrimaryMetric ĐÃ ĐƯỢC ĐỊNH NGHĨA TRƯỚC KHI SỬ DỤNG
  const enhancedCampaigns: CampaignListItem[] = campaigns.map(
    (campaign, index) => ({
      ...campaign,
      primaryMetric: getPrimaryMetric(campaign.activityType),
      participants: Math.floor(Math.random() * 50) + 10,
      totalDistance: Math.floor(Math.random() * 3000) + 500,
      pendingSubmissions: Math.floor(Math.random() * 10),
      image: campaign.imageUrl || MOCK_IMAGES[index % MOCK_IMAGES.length],
    }),
  );

  const filteredCampaigns = enhancedCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPendingSubmissions = enhancedCampaigns.reduce(
    (sum, campaign) => sum + (campaign.pendingSubmissions || 0),
    0,
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              Campaign Management
            </h2>
            <p className="mt-1 text-muted-foreground">
              Manage and monitor all employee activity campaigns
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Button
                onClick={onViewApprovals}
                variant="outline"
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                View Approvals
              </Button>
              {totalPendingSubmissions > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {totalPendingSubmissions}
                </Badge>
              )}
            </div>
            <Button onClick={onCreateCampaign} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <Input
            placeholder="Search campaigns..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">Filter</Button>
        </div>

        {/* Campaign Cards */}
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative h-40 w-full flex-shrink-0 bg-muted md:w-48">
                  <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {campaign.name}
                      </h3>
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {getStatusDisplay(campaign.status)}
                      </Badge>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      {campaign.description}
                    </p>

                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Activity Type
                        </p>
                        <p className="font-semibold capitalize text-foreground">
                          {campaign.activityType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Primary Metric
                        </p>
                        <p className="font-semibold text-foreground">
                          {campaign.primaryMetric}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Participants
                        </p>
                        <p className="font-semibold text-foreground">
                          {campaign.participants}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Distance
                        </p>
                        <p className="font-semibold text-foreground">
                          {campaign.totalDistance} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {campaign.status !== 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setEditingCampaign(campaign)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => onViewCampaign(campaign)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {campaign.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onViewFinalRankings(campaign)}
                      >
                        <Trophy className="h-4 w-4" />
                        Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-foreground">
                No campaigns found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first campaign'}
              </p>
            </div>
          </Card>
        )}
      </div>

      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
        />
      )}
    </>
  );
}
