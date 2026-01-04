import ChangeRequestsHistory from '@/feature/employee/profile-management/components/ChangeRequestsHistory';
import IDsInfo from '@/feature/employee/profile-management/components/IDs/IDsInfo';

export default function EmployeeIDs() {
  return (
    <div className="flex w-full flex-col gap-6">
      <IDsInfo />
      <ChangeRequestsHistory />
    </div>
  );
}
