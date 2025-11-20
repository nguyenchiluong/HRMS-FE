import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Personal Information", path: "/profile/personal-info" },
  { label: "Job Details", path: "/profile/job-details" },
  { label: "Time Requests", path: "/requests" },
  { label: "Activities", path: "/my-activities" },
  { label: "Bonus", path: "/credits" },
];

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-full lg:w-[335px] bg-white lg:h-screen overflow-y-auto flex-shrink-0">
      <div className="relative h-[77px] bg-hrms-primary">
        <svg
          className="w-full h-full"
          viewBox="0 0 335 77"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 77V0H335V77C335 77 238.475 41.25 166.932 42.625C95.3898 44 0 77 0 77Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="px-[30px] py-10">
        <div className="flex flex-col items-center gap-2.5 mb-12">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7bb6d302954f5b07e4f5004d5638a99a7f2c1fa7?width=240"
              alt="Employee profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-[30px] font-semibold text-center leading-tight">
            Kid Nguyen<br />(Kiet Nguyen)
          </h2>
          
          <p className="text-[15px] font-light text-center">he/him</p>
          
          <p className="text-[18px] font-light text-center">
            Associate, Software Engineer
          </p>
        </div>

        <nav className="flex flex-col gap-0">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full px-5 py-2.5 text-left rounded-[10px] text-[17px] font-medium transition-colors",
                  isActive
                    ? "bg-hrms-bg-light text-hrms-primary font-semibold"
                    : "text-hrms-primary font-medium hover:bg-hrms-bg-light/50"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
