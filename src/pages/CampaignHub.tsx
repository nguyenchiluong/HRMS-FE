import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useActiveCampaigns, useRegisterCampaign } from "@/hooks/useCampaigns";
import { Brain, Calendar, Footprints, Loader2, Trophy, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EmployeeCampaignHub() {
  const { data: campaigns, isLoading, error } = useActiveCampaigns();
  const registerMutation = useRegisterCampaign();
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const handleRegister = async (campaignId: string) => {
    try {
      setRegisteringId(campaignId);
      await registerMutation.mutateAsync(campaignId);
      toast.success("Successfully registered! Get ready to start.");
    } catch (err: any) {
      // Extract error message from Axios error if possible
      const message = err.response?.data || "Failed to register. You might be already registered.";
      toast.error(message);
    } finally {
      setRegisteringId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load campaigns. Please try again later.
      </div>
    );
  }

  const activeCampaignsList = campaigns || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Campaigns Hub</h1>
          <p className="text-slate-500">
            Join campaigns, track your participation, and view your achievements
          </p>
        </div>

        {/* SECTION 1: Campaigns You Can Join */}
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
                <Card 
                  key={campaign.id} 
                  className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Campaign Image */}
                  <div className="h-40 w-full relative bg-slate-100">
                    <img 
                      src={campaign.imageUrl || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=300&fit=crop"} 
                      alt={campaign.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm">
                        {campaign.activityType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                      {campaign.name}
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
                      {campaign.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        {/* Mock participant count since API might not return it yet */}
                        <span>12 participants joined</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 mt-auto">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      onClick={() => handleRegister(campaign.id)}
                      disabled={registeringId === campaign.id}
                    >
                      {registeringId === campaign.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator className="my-8" />

        {/* SECTION 2: My Active Campaigns (Static Demo for now) */}
        <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Active Campaigns</h2>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Running Now
                </Badge>
            </div>
            
            {/* This would be populated by a separate API call later */}
            <Card className="flex flex-col md:flex-row overflow-hidden border-slate-200 shadow-sm">
                <div className="w-full md:w-64 h-48 md:h-auto relative">
                     <img 
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop" 
                        alt="Cycling" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">Cycling Challenge 2025</h3>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                              CYCLING
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">
                          Cycle 100km this month and earn points. Track your rides and compete with colleagues in this intensive cardio challenge.
                        </p>
                        
                        <div className="mb-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-700">Campaign Progress</span>
                                <span className="font-bold text-slate-900">75%</span>
                            </div>
                            <Progress value={75} className="h-2 bg-slate-100" />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                              <span>0 km</span>
                              <span>Target: 100 km</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 inline-flex items-center gap-3">
                            <div className="bg-yellow-100 p-1.5 rounded-full">
                              <Trophy className="w-4 h-4 text-yellow-600" /> 
                            </div>
                            <span className="text-sm text-slate-700">
                              Current Rank: <strong>#12</strong> of 32
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                         <Button className="flex-1 bg-slate-900 hover:bg-slate-800">
                            Submit Activity
                         </Button>
                         <Button variant="outline" className="flex-1">
                            View Leaderboard
                         </Button>
                    </div>
                </div>
            </Card>
        </section>
      </div>
    </div>
  );
}