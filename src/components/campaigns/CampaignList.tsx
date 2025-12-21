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
} from "@/components/ui/alert-dialog"; // <--- Import mới
import { Edit2, Eye, Trophy, Plus, CheckCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import EditCampaignModal from "./EditCampaignModal";
import type { Campaign, CampaignListItem } from "@/types/campaign";
import { usePublishCampaign } from "@/hooks/useCampaigns";
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
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop"
];

const getPrimaryMetric = (activityType: string) => {
  switch (activityType) {
    case "walking":
    case "running":
      return "Distance (km)";
    case "cycling":
      return "Distance (km)";
    default:
      return "Points";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active": return "success"; // Hoặc "default" nếu theme chưa có success
    case "draft": return "secondary";
    case "completed": return "outline";
    default: return "outline";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "active": return "Active";
    case "draft": return "Draft";
    case "completed": return "Completed";
    default: return status;
  }
};

// --- COMPONENT PublishButton (Giao diện Modal xịn xò) ---
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
          className="gap-2 bg-green-600 hover:bg-green-700 text-white" // Style màu xanh lá
          disabled={publishMutation.isPending}
          onClick={(e) => e.stopPropagation()} // Chặn click lan ra Card
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

// --- COMPONENT CHÍNH ---
export default function CampaignList({ 
  campaigns, 
  onCreateCampaign, 
  onViewCampaign, 
  onViewFinalRankings, 
  onViewApprovals 
}: CampaignListProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const enhancedCampaigns: CampaignListItem[] = campaigns.map((campaign, index) => ({
    ...campaign,
    primaryMetric: getPrimaryMetric(campaign.activityType),
    participants: Math.floor(Math.random() * 50) + 10,
    totalDistance: Math.floor(Math.random() * 3000) + 500,
    pendingSubmissions: Math.floor(Math.random() * 10),
    image: campaign.imageUrl || MOCK_IMAGES[index % MOCK_IMAGES.length]
  }));

  const filteredCampaigns = enhancedCampaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPendingSubmissions = enhancedCampaigns.reduce(
    (sum, campaign) => sum + (campaign.pendingSubmissions || 0), 0
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Campaign Management</h2>
            <p className="text-muted-foreground mt-1">
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
                <CheckCircle className="w-4 h-4" />
                View Approvals
              </Button>
              {totalPendingSubmissions > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalPendingSubmissions}
                </Badge>
              )}
            </div>
            <Button 
              onClick={onCreateCampaign} 
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
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
          <Button variant="outline">
            Filter
          </Button>
        </div>

        {/* Campaign Cards */}
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-40 flex-shrink-0 relative bg-muted">
                  <img 
                    src={campaign.image} 
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{campaign.name}</h3>
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {getStatusDisplay(campaign.status)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{campaign.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Activity Type</p>
                        <p className="font-semibold text-foreground capitalize">{campaign.activityType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Primary Metric</p>
                        <p className="font-semibold text-foreground">{campaign.primaryMetric}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-semibold text-foreground">{campaign.participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Distance</p>
                        <p className="font-semibold text-foreground">{campaign.totalDistance} km</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* NÚT BẤM */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {/* Nút Publish hiện đại - Chỉ hiện khi Draft */}
                    {campaign.status === 'draft' && (
                      <PublishButton campaignId={campaign.id} />
                    )}

                    {campaign.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setEditingCampaign(campaign)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => onViewCampaign(campaign)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    {campaign.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onViewFinalRankings(campaign)}
                      >
                        <Trophy className="w-4 h-4" />
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