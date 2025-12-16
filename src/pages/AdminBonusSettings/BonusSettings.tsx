import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const API_URL = "http://localhost:8080/api/bonus-settings";

export default function BonusCreditPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      baseBonusCredits: 0,
      conversionRate: 0,
      creditDay: 1, // 1–28
    },
    validationSchema: Yup.object({
      baseBonusCredits: Yup.number()
        .required("Base credits are required")
        .positive("Must be a positive number")
        .integer("Must be an integer"),

      conversionRate: Yup.number()
        .required("Conversion rate is required")
        .positive("Must be positive"),

      creditDay: Yup.number()
        .required("Credit day is required")
        .integer("Must be a whole number")
        .min(1, "Minimum day is 1")
        .max(28, "Maximum day is 28"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(API_URL, {
          method: "POST", // change to PUT if updating
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to save bonus settings");
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchBonusSettings = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch bonus settings");
        }

        const data = await res.json();

        if (data) {
          formik.setValues({
            baseBonusCredits: data.baseBonusCredits ?? 0,
            conversionRate: data.conversionRate ?? 0,
            creditDay: data.creditDay ?? 1,
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonusSettings();
  }, []);

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
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
          <form onSubmit={formik.handleSubmit}>
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Bonus Credit Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Credits & Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Base Bonus Credits */}
                  <div className="p-4 bg-white rounded-xl shadow-sm border">
                    <p className="text-gray-600 text-sm">
                      Base Bonus Credits
                    </p>

                    <input
                      name="baseBonusCredits"
                      type="number"
                      disabled={!isEditing}
                      className="border rounded-xl p-3 w-full mt-1 disabled:bg-gray-50"
                      value={formik.values.baseBonusCredits}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {isEditing &&
                      formik.touched.baseBonusCredits &&
                      formik.errors.baseBonusCredits && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.baseBonusCredits}
                        </p>
                      )}
                  </div>

                  {/* Conversion Rate */}
                  <div className="p-4 bg-white rounded-xl shadow-sm border">
                    <p className="text-gray-600 text-sm">Conversion Rate</p>

                    <input
                      name="conversionRate"
                      type="number"
                      step="0.01"
                      disabled={!isEditing}
                      className="border rounded-xl p-3 w-full mt-1 disabled:bg-gray-50"
                      value={formik.values.conversionRate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {isEditing &&
                      formik.touched.conversionRate &&
                      formik.errors.conversionRate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.conversionRate}
                        </p>
                      )}
                  </div>
                </div>

                {/* Credit Day */}
                <div className="p-4 bg-white rounded-xl shadow-sm border">
                  <p className="text-gray-600 text-sm">
                    Credit Day (Monthly Distribution)
                  </p>

                  {isEditing ? (
                    <>
                      <select
                        name="creditDay"
                        value={formik.values.creditDay}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border rounded-xl p-3 w-full mt-1"
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map(
                          (day) => (
                            <option key={day} value={day}>
                              Day {day}
                            </option>
                          )
                        )}
                      </select>

                      {formik.touched.creditDay &&
                        formik.errors.creditDay && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.creditDay}
                          </p>
                        )}
                    </>
                  ) : (
                    <p className="text-xl font-medium mt-1">
                      Day {formik.values.creditDay} of every month
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Update
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
}
