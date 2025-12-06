import { useFilterStore } from '../store/filterStore';

export default function Overview() {
  const { employees, getManagersCount } = useFilterStore();
  const totalEmployees = employees.length;
  const totalManagers = getManagersCount();
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Total Employees</p>
            <p className='text-black'>{totalEmployees}</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>

        {/* Onboarding */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Onboarding Employees</p>
            <p className='text-black'>0</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>


        {/* Resigned */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Resigned Employees</p>
            <p className='text-black'>0</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>

        {/* Managers */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Managers</p>
            <p className='text-black'>{totalManagers}</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>
      </div>
    </div>
  );
}