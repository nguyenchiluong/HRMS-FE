import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ConfirmSettingsModal } from "./ConfirmSettingsModal";

type Props = {
  initialValues: {
    baseBonusCredits: number;
    conversionRate: number;
    date: number;
  };
  onSave: (values: Props["initialValues"]) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
};

export default function BonusSettingsEdit({
  initialValues,
  onSave,
  onCancel,
  isSaving = false,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      baseBonusCredits: Yup.number()
        .required("Base credits are required")
        .positive("Must be greater than 0")
        .max(1000000, "Maximum 1,000,000 credits"),

      conversionRate: Yup.number()
        .required("Conversion rate is required")
        .positive("Must be greater than 0")
        .integer("Must be a whole number")
        .max(1000000, "Maximum 1,000,000 VND per credit")
        .test(
          "multiple-of-1000",
          "Must be a multiple of 1000",
          (value) => (value ?? 0) % 1000 === 0,
        ),

      date: Yup.number()
        .required("Credit day is required")
        .min(1, "Earliest day is 1")
        .max(28, "Latest selectable day is 28"),
    }),
    onSubmit: () => {
      // Show confirmation modal instead of directly saving
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    try {
      await onSave(formik.values);
      setConfirmOpen(false);
    } catch (error) {
      // Error handling is done in parent component
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle className="text-2xl font-semibold">
                Bonus Credit Settings
              </CardTitle>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Editing
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <InputField
              label="Base Bonus Credits"
              name="baseBonusCredits"
              type="number"
              max="1000000"
              formik={formik}
              helper="Granted to each eligible user every month (max 1,000,000)"
            />

            <InputField
              label="Conversion Rate"
              name="conversionRate"
              type="number"
              max="1000000"
              step="1000"
              formik={formik}
              helper="1 Credit equals this many VND, must be multiple of 1,000 (max 1,000,000)"
            />

            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <p className="text-gray-600 text-sm">Credit Day</p>
              <select
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                className="border rounded-xl p-3 w-full mt-1"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                To ensure consistent monthly distribution, selectable days are limited to 1–28.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-yellow-800 font-medium">
                <AlertTriangle size={16} />
                Important
              </div>
              <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                <li>Changes apply to future bonus distributions only</li>
                <li>Modifying these settings affects all eligible users</li>
                <li>Issued bonus credits cannot be automatically reversed</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formik.isValid || isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <ConfirmSettingsModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        settings={formik.values}
        isLoading={isSaving}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function InputField({
  label,
  name,
  formik,
  helper,
  max,
  ...props
}: any) {
  const id = name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Clamp to max if provided
    if (max && value) {
      const numValue = Number(value);
      if (numValue > max) {
        e.target.value = String(max);
      }
    }

    formik.handleChange(e);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <label htmlFor={id} className="text-gray-600 text-sm">
        {label}
      </label>
      <input
        name={name}
        id={id}
        {...props}
        max={max}
        value={formik.values[name]}
        onChange={handleChange}
        className="border rounded-xl p-3 w-full mt-1"
      />
      {helper && (
        <p className="text-xs text-muted-foreground mt-1">{helper}</p>
      )}
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {formik.errors[name]}
        </p>
      )}
    </div>
  );
}
