import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Personal Information", path: "/employee/profile" },
  { label: "Job Details", path: "/employee/job-details" },
  { label: "Time Requests", path: "/employee/requests" },
  { label: "Activities", path: "/employee/my-activities" },
  { label: "Bonus", path: "/employee/credits" },
];

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-full lg:w-[335px] bg-white lg:h-screen overflow-y-auto flex-shrink-0">
      <div className="relative">
        <svg
          className="w-full h-16 lg:h-[77px]"
          viewBox="0 0 335 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 77V0H335V77C335 77 238.475 41.25 166.932 42.625C95.3898 44 0 77 0 77Z"
            fill="#253D90"
          />
        </svg>
      </div>

      <div className="px-4 lg:px-[30px] py-6 lg:py-[75px] flex flex-col items-center">
        <div className="w-24 h-24 lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden bg-gray-200 mb-4">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/7bb6d302954f5b07e4f5004d5638a99a7f2c1fa7?width=240"
            alt="Employee Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl lg:text-[30px] font-semibold text-black text-center font-poppins mb-1">
          Kid Nguyen
          <br />
          (Kiet Nguyen)
        </h2>

        <p className="text-sm lg:text-[15px] font-light text-black text-center font-poppins mb-1">
          he/him
        </p>

        <p className="text-base lg:text-lg font-light text-black text-center font-poppins">
          Associate, Software Engineer
        </p>
      </div>

        <nav className="flex flex-col gap-0 pl-[29px] pr-[30px]">
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
    </aside>
  );
}
