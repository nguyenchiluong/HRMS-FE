import NavigationBar from "@/pages/employeeProfileManagement/components/NavigationBar";
import EmployeeSidebar from "@/pages/employeeProfileManagement/components/EmployeeSidebar";
import ProfileTabs from "@/pages/employeeProfileManagement/components/ProfileTabs";

export default function Financial() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="flex flex-col lg:flex-row">
        <EmployeeSidebar />
        
        <main className="flex-1 bg-hrms-bg-page min-h-[calc(100vh-85px)] p-4 lg:p-[30px]">
          <div className="flex flex-col gap-[30px] max-w-[1177px]">
            <ProfileTabs />
            <div className="bg-white rounded-[20px] p-[30px]">
              <h2 className="text-2xl font-semibold mb-4">Financial Details</h2>
              <p className="text-gray-600">Financial information content coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
