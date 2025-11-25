import NavigationBar from "@/pages/employeeProfileManagement/components/NavigationBar";
import EmployeeSidebar from "@/pages/employeeProfileManagement/components/EmployeeSidebar";
import ProfileTabs from "@/pages/employeeProfileManagement/components/ProfileTabs";
import "./EmployeeIDs.standalone.css";
import EditIDsContent from "../components/EditIDsContent";

export default function EmployeeEditIDs() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="flex flex-col lg:flex-row">
        <EmployeeSidebar />
        
        <main className="flex-1 bg-hrms-bg-page min-h-[calc(100vh-85px)] p-4 lg:p-[30px]">
          <div className="flex flex-col gap-[30px] max-w-[1177px]">
            <ProfileTabs />
            <EditIDsContent />
          </div>
        </main>
      </div>
    </div>
  );
}
