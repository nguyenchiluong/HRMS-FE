import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import BonusSettingsView from "./BonusSettingsView";
import BonusSettingsEdit from "./BonusSettingsEdit";
import { toast } from "sonner"

const API_URL = "http://localhost:8080/api/credits/settings";

export default function BonusCreditPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    baseBonusCredits: 0,
    conversionRate: 0,
    date: 1,
  });

  useEffect(() => {
    const fetchBonusSettings = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setSettings({
          baseBonusCredits: data.baseBonusCredits ?? 0,
          conversionRate: data.conversionRate ?? 0,
          date: data.date ?? 1,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonusSettings();
  }, []);

  const handleSave = async (values: typeof settings) => {
    try {
    const payload = {
      baseBonusCredits: Number(values.baseBonusCredits),
      conversionRate: Number(values.conversionRate),
      date: Number(values.date),
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
  let message = "Failed to save bonus settings";

  try {
    const errorData = await res.json();

    if (errorData && typeof errorData === "object") {
      message = Object.values(errorData).join(", ");
    }
  } catch {
    // fallback if response is not JSON
    message = await res.text();
  }

  throw new Error(message);
}

    const refreshed = await fetch(API_URL);
    const data = await refreshed.json();

    setSettings({
      baseBonusCredits: data.baseBonusCredits ?? 0,
      conversionRate: data.conversionRate ?? 0,
      date: data.date ?? data.creditDate ?? 1,
    });

    setIsEditing(false);

    toast.success("Bonus settings saved successfully");
  } catch (error: any) {
    console.error(error);

    toast.error(
      error?.message || "Something went wrong while saving"
    );
  }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 space-x-2">
        <div className="flex items-center space-x-2">
          <Users />
          <div className="font-bold text-[#253D90] text-xl">
            Bonus Management
          </div>
        </div>
      </div>

      <div className="min-h-screen p-6 flex justify-center items-start">
        <div className="w-full max-w-3xl">
          {isEditing ? (
            <BonusSettingsEdit
              initialValues={settings}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
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
