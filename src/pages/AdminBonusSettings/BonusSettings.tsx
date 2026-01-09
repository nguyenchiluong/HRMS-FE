import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import springApi from "@/api/spring";
import BonusSettingsView from "./BonusSettingsView";
import BonusSettingsEdit from "./BonusSettingsEdit";
import { toast } from "sonner";

type BonusSettings = {
  baseBonusCredits: number;
  conversionRate: number;
  date: number;
};

export default function BonusCreditPage() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings = { baseBonusCredits: 0, conversionRate: 0, date: 1 }, isLoading, error: queryError, refetch } = useQuery<BonusSettings>({
    queryKey: ["bonusSettings"],
    queryFn: async () => {
      const { data } = await springApi.get("/api/credits/settings");
      return {
        baseBonusCredits: data.baseBonusCredits ?? 0,
        conversionRate: data.conversionRate ?? 0,
        date: data.date ?? 1,
      };
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: BonusSettings) => {
      const payload = {
        baseBonusCredits: Number(values.baseBonusCredits),
        conversionRate: Number(values.conversionRate),
        date: Number(values.date),
      };
      const { data } = await springApi.post("/api/credits/settings", payload);
      return {
        baseBonusCredits: data.baseBonusCredits ?? 0,
        conversionRate: data.conversionRate ?? 0,
        date: data.date ?? data.creditDate ?? 1,
      };
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(["bonusSettings"], newSettings);
      setIsEditing(false);
      toast.success("Bonus settings saved successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Something went wrong while saving";
      toast.error(message);
    },
  });

  const handleSave = async (values: BonusSettings): Promise<void> => {
    return new Promise((resolve, reject) => {
      saveMutation.mutate(values, {
        onSuccess: () => resolve(),
        onError: () => reject(),
      });
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-primary" />
            <span className="text-sm text-muted-foreground">Loading bonus settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl">
          {queryError && (
            <div className="mb-4 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <div className="flex items-center justify-between">
                <span>Unable to load bonus settings. Please try again.</span>
                <button
                  onClick={() => refetch()}
                  className="text-xs font-medium text-destructive underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            </div
            >
          )}
          {isEditing ? (
            <BonusSettingsEdit
              initialValues={settings}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              isSaving={saveMutation.isPending}
            />
          ) : (
            <BonusSettingsView
              settings={settings}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}
