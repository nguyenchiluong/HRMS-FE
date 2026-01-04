import NavigationBar from "@/feature/employee/profile-management/components/NavigationBar";
import EmployeeSidebar from "@/feature/employee/profile-management/components/EmployeeSidebar";
import ProfileTabs from "@/feature/employee/profile-management/components/ProfileTabs";
import EducationContent from "@/feature/employee/profile-management/components/EducationContent";
import "./EmployeeIDs.standalone.css";

export default function EmployeeEducation() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="flex flex-col lg:flex-row">
        <EmployeeSidebar />
        
        <main className="flex-1 bg-hrms-bg-page min-h-[calc(100vh-85px)] p-4 lg:p-[30px]">
          <div className="flex flex-col gap-[30px] max-w-[1177px]">
            <ProfileTabs />
            <EducationContent />
          </div>
        </main>
      </div>
    </div>
  );
}
