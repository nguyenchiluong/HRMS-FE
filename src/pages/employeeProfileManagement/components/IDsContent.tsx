import { Eye } from "lucide-react";

interface InfoRow {
  label: string;
  value: string;
  hasVisibilityToggle?: boolean;
}

const basicInfo: InfoRow[] = [
  { label: "Legal Full Name", value: "Nguyen Tuan Kiet" },
  { label: "Nationality", value: "Vietnam" },
];

const nationalID: InfoRow[] = [
  { label: "Identification #", value: "XXXXXXXXXXXX", hasVisibilityToggle: true },
  { label: "Issued Date", value: "22/04/2021" },
  { label: "Expiration Date", value: "25/09/2028" },
  {
    label: "Issued By",
    value: "Director General of The Police Department for Administrative Management of Social Order",
  },
];

const socialInsurance: InfoRow[] = [
  { label: "Identification #", value: "5220031234" },
];

const taxID: InfoRow[] = [
  { label: "Identification #", value: "5220031234" },
];

function InfoRowComponent({ label, value, hasVisibilityToggle }: InfoRow) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-[45px] px-2.5 py-1.5">
      <div className="w-full sm:w-[240px] text-[17px] font-medium flex-shrink-0">
        {label}
      </div>
      <div className="flex items-center gap-3 text-hrms-text-secondary text-[17px]">
        <span>{value}</span>
        {hasVisibilityToggle && (
          <button className="text-hrms-text-muted hover:text-hrms-primary">
            <Eye className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function IDsContent() {
  return (
    <div className="bg-white rounded-[25px] p-6 lg:p-[45px] flex flex-col gap-2.5">
      <h2 className="text-[25px] font-semibold mb-2.5">Your IDs</h2>

      <div className="flex flex-col gap-2.5 pb-[30px]">
        {basicInfo.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">National ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {nationalID.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">Social Insurance Number ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {socialInsurance.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <h3 className="text-hrms-primary text-[17px] font-medium">Tax ID</h3>
      <div className="flex flex-col gap-2.5 pb-[30px]">
        {taxID.map((info, index) => (
          <InfoRowComponent key={index} {...info} />
        ))}
      </div>

      <button className="w-[168px] h-[60px] bg-hrms-bg-light rounded-[25px] text-black text-xl font-medium hover:bg-hrms-bg-light/80 transition-colors">
        EDIT
      </button>
    </div>
  );
}
