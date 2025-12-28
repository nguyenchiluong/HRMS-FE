import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  initialValues: {
    baseBonusCredits: number;
    conversionRate: number;
    date: number;
  };
  onSave: (values: Props["initialValues"]) => Promise<void>;
  onCancel: () => void;
};

export default function BonusSettingsEdit({
  initialValues,
  onSave,
  onCancel,
}: Props) {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      baseBonusCredits: Yup.number()
        .required()
        .positive()
        .integer(),

      conversionRate: Yup.number()
        .required()
        .positive()
        .integer(),

      date: Yup.number()
        .required()
        .min(1)
        .max(28),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSave(values);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Edit Bonus Credit Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <InputField
            label="Base Bonus Credits"
            name="baseBonusCredits"
            type="number"
            max="999999999"
            formik={formik}
          />

          <InputField
            label="Conversion Rate"
            name="conversionRate"
            type="number"
            max="999999999"
            step="1000"
            formik={formik}
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
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function InputField({
  label,
  name,
  formik,
  ...props
}: any) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <p className="text-gray-600 text-sm">{label}</p>
      <input
        name={name}
        {...props}
        value={formik.values[name]}
        onChange={formik.handleChange}
        className="border rounded-xl p-3 w-full mt-1"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {formik.errors[name]}
        </p>
      )}
    </div>
  );
}
