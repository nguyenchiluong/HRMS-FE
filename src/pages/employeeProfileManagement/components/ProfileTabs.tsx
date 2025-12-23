import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface Tab {
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { label: "Personal Information", path: "/employee/profile/personal-info" },
  { label: "IDs", path: "/employee/profile/ids" },
  { label: "Education", path: "/employee/profile/education" },
  { label: "Financial Details", path: "/employee/profile/financial" },
];

export default function ProfileTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-[30px] bg-white rounded-[20px] px-4 lg:px-[30px] py-2.5 h-auto lg:h-[70px]">
      {tabs.map((tab, index) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={index}
            onClick={() => navigate(tab.path)}
            className={cn(
              "text-[17px] font-medium text-center whitespace-nowrap",
              isActive
                ? "text-hrms-primary underline decoration-solid underline-offset-2"
                : "text-black hover:text-hrms-primary"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
