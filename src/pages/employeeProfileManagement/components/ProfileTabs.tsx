import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  active: boolean;
}

const tabs: Tab[] = [
  { label: "Personal Information", active: false },
  { label: "IDs", active: true },
  { label: "Education", active: false },
  { label: "Financial Details", active: false },
];

export default function ProfileTabs() {
  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-[30px] bg-white rounded-[20px] px-4 lg:px-[30px] py-2.5 h-auto lg:h-[70px]">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={cn(
            "text-[17px] font-medium text-center whitespace-nowrap",
            tab.active
              ? "text-hrms-primary underline decoration-solid underline-offset-2"
              : "text-black hover:text-hrms-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
