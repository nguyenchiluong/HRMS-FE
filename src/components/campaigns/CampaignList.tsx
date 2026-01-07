import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// 👇 Đã bỏ icon X (và Ban) khỏi import
import { Edit2, Trophy, Plus, CheckCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import EditCampaignModal from "./EditCampaignModal";
import type { Campaign, CampaignListItem } from "@/types/campaign";
import { usePublishCampaign, useCloseCampaign } from "@/hooks/useCampaigns"; 
import { usePendingCampaigns } from "@/hooks/useApprovals"; 
import toast from "react-hot-toast";

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
    case "active": return "success"; 
    case "draft": return "secondary";
    case "completed": return "outline";
    default: return "outline";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'active': return 'Active';
    case 'draft': return 'Draft';
    case 'completed': return 'Completed';
    default: return status;
  }
};

// --- COMPONENT PublishButton ---
const PublishButton = ({ campaignId }: { campaignId: string }) => {
  const publishMutation = usePublishCampaign();

  const onConfirmPublish = async () => {
    try {
      await publishMutation.mutateAsync(campaignId);
      toast.success("Campaign published successfully! 🚀");
    } catch (error) {
      toast.error("Failed to publish campaign");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          disabled={publishMutation.isPending}
          onClick={(e) => e.stopPropagation()}
        >
          {publishMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {publishMutation.isPending ? "Publishing..." : "Publish"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone immediately. This will create an active campaign 
            and it will be visible to <strong>all employees</strong> in the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmPublish}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// --- COMPONENT CloseButton (ĐÃ BỎ ICON) ---
const CloseButton = ({ campaignId, campaignName }: { campaignId: string, campaignName: string }) => {
  const closeMutation = useCloseCampaign();

  const onConfirmClose = async () => {
    try {
      await closeMutation.mutateAsync(campaignId);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          // Style: Viền đỏ nhạt, chữ đỏ, hover nền đỏ rất nhạt
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
          disabled={closeMutation.isPending}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 👇 Chỉ hiện Loader khi đang loading, còn bình thường không hiện icon gì cả */}
          {closeMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          
          {/* Text đơn giản */}
          {closeMutation.isPending ? "Closing..." : "Close Campaign"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Campaign "{campaignName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will stop all submissions and move the campaign to the archive. 
            The final leaderboard will be published to all participants.
            <br/><br/>
            <strong className="text-red-600">This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmClose}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// --- COMPONENT CHÍNH ---
export default function CampaignList({ 
  campaigns, 
  onCreateCampaign, 
  onViewFinalRankings, 
  onViewApprovals 
}: CampaignListProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: pendingCampaignsData } = usePendingCampaigns();

  const totalPendingSubmissions = pendingCampaignsData?.reduce(
    (sum, item) => sum + (item.pendingCount || 0), 
    0
  ) || 0;

  const enhancedCampaigns: CampaignListItem[] = campaigns.map((campaign, index) => ({
    ...campaign,
    primaryMetric: getPrimaryMetric(campaign.activityType),
    participants: campaign.participantCount || 0,
    totalDistance: Number((campaign.totalDistance || 0).toFixed(1)),
    pendingSubmissions: 0, 
    image: campaign.imageUrl || MOCK_IMAGES[index % MOCK_IMAGES.length]
  }));

  const filteredCampaigns = enhancedCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
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
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs animate-in zoom-in"
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
                <div className="w-full md:w-48 h-40 flex-shrink-0 relative bg-muted">
                  <img 
                    src={campaign.image} 
                    alt={campaign.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
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

                  {/* NÚT BẤM (BUTTONS) */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    
                    {/* 1. Nếu là DRAFT -> Hiện nút Publish */}
                    {campaign.status === 'draft' && (
                      <PublishButton campaignId={campaign.id} />
                    )}

                    {/* 2. Nếu là ACTIVE -> Hiện nút Close (Không Icon) */}
                    {campaign.status === 'active' && (
                      <CloseButton campaignId={campaign.id} campaignName={campaign.name} />
                    )}

                    {/* Nút Edit */}
                    {campaign.status !== "completed" && (
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

                    {/* Nút View Leaderboard */}
                    <Button
                      variant={campaign.status === 'completed' ? "default" : "outline"}
                      size="sm"
                      className={`gap-2 ${
                        campaign.status === 'completed' 
                          ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' 
                          : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                      }`}
                      onClick={() => onViewFinalRankings(campaign)} 
                    >
                      <Trophy className="h-4 w-4" />
                      {campaign.status === 'completed' ? "View Final Leaderboard" : "View Leaderboard"}
                    </Button>

                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
            <Card>
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium text-foreground">No campaigns found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first campaign"}
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