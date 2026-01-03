import { Menu, Search, Bell, Archive } from "lucide-react";

export default function NavigationBar() {
  return (
    <nav className="h-[85px] bg-hrms-bg-light flex items-center px-0 w-full border-b border-[#BDD2E0]">
      <div className="flex items-center justify-center gap-2.5 w-[100px] lg:w-[148px] h-full border-r border-[#BDD2E0] px-2">
        <Menu className="w-5 h-5 text-hrms-text-secondary flex-shrink-0" />
        <span className="text-hrms-text-secondary text-sm lg:text-xl font-medium hidden sm:inline">Menu</span>
      </div>

      <div className="flex-1 flex items-center justify-between px-2 lg:px-6 gap-2 lg:gap-6">
        <h1 className="text-hrms-primary-light font-reem text-lg lg:text-[25px] font-bold lg:ml-6 flex-shrink-0">
          HRMS
        </h1>

        <div className="relative flex-1 max-w-[721px] mx-2 lg:mx-auto">
          <div className="absolute inset-0 bg-[rgba(196,196,196,0.55)] rounded-[25px]" />
          <input
            type="text"
            placeholder="Search..."
            className="relative w-full h-[45px] lg:h-[55px] bg-transparent rounded-[25px] pl-6 lg:pl-10 pr-10 lg:pr-14 text-sm lg:text-xl text-hrms-text-muted placeholder:text-hrms-text-muted focus:outline-none"
          />
          <Search className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 w-5 lg:w-7 h-5 lg:h-7 text-[#C4C4C4]" />
        </div>

        <div className="flex items-center gap-2 lg:gap-5 flex-shrink-0">
          <div className="relative hidden sm:block">
            <Bell className="w-6 lg:w-7 h-6 lg:h-7 text-hrms-text-muted" />
            <div className="absolute -top-2 -right-2 w-[21px] h-[21px] bg-hrms-red rounded-full flex items-center justify-center border border-white shadow-md">
              <span className="text-white text-[11px] font-bold">13</span>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Archive className="w-8 lg:w-10 h-8 lg:h-10 text-[#8C8C8C]" />
            <div className="absolute -top-1 -right-1 w-[21px] h-[21px] bg-hrms-red rounded-full flex items-center justify-center border border-white shadow-md">
              <span className="text-white text-[11px] font-bold">13</span>
            </div>
          </div>

          <div className="relative w-[45px] h-[45px] lg:w-[55px] lg:h-[55px]">
            <div className="absolute inset-0 bg-hrms-yellow rounded-full" />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b52fb025676f8554145cc25fc248556d53045a17?width=106"
              alt="User avatar"
              className="absolute inset-[1px] w-[43px] h-[43px] lg:w-[53px] lg:h-[53px] rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
