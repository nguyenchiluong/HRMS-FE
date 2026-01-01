import NavigationBar from "@/pages/employeeProfileManagement/components/NavigationBar";
import EmployeeSidebar from "@/pages/employeeProfileManagement/components/EmployeeSidebar";
import ProfileTabs from "@/pages/employeeProfileManagement/components/ProfileTabs";
import FinancialDetails from "../components/FinancialDetails";

export default function Financial() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <div className="flex flex-col lg:flex-row">
        <EmployeeSidebar />
        <main className="flex-1 bg-hrms-bg-page min-h-[calc(100vh-85px)] p-4 lg:p-[30px]">
          <div className="flex flex-col gap-[30px] max-w-[1177px]">
            <ProfileTabs />
            <FinancialDetails />
          </div>
        </main>
      </div>
    </div>
  );
}
