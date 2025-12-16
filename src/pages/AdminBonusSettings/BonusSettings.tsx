import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react"

export default function BonusCreditPage() {
  const [date, setDate] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  const baseBonusCredits = 100;
  const conversionRate = 1.5;

  return (
	<>
    	<div className="flex items-center justify-between bg-white p-4 space-x-2">
      {/* Left: Title */}
      <div className="flex items-center space-x-2">
        <Users/>
        <div className="font-bold text-[#253D90] text-xl">Bonus Management</div>
      </div>
	  </div>
    
    <div className="min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Bonus Credit Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-600 text-sm">Base Bonus Credits</p>
                {isEditing ? (
                  <input
                    type="number"
                    defaultValue={baseBonusCredits}
                    className="border rounded-xl p-3 w-full mt-1"
                  />
                ) : (
                  <p className="text-xl font-medium mt-1">{baseBonusCredits}</p>
                )}
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={conversionRate}
                    className="border rounded-xl p-3 w-full mt-1"
                  />
                ) : (
                  <p className="text-xl font-medium mt-1">{conversionRate}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border space-y-2">
              <p className="text-gray-600 text-sm">Credit Date</p>
              {isEditing ? (
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-xl p-3 w-full"
                />
              ) : (
                <p className="text-xl font-medium">{date || "Not set"}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <Button className="rounded-xl px-6 py-2 text-base" onClick={() => setIsEditing(true)}>Update</Button>
              ) : (
                <>
                  <Button className="rounded-xl px-6 py-2 text-base" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button className="rounded-xl px-6 py-2 text-base">Save Changes</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
	</>
  );
}
