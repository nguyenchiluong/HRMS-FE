import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useState } from 'react';
import OnboardEmployeeModal from './OnboardEmployeeModal';

export default function TitleBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <OnboardEmployeeModal onClose={() => setIsModalOpen(false)} />
      )}
      <div className="flex items-center justify-between space-x-2 bg-white p-4">
        {/* Left: Title */}
        <div className="flex items-center space-x-2">
          <Users />
          <div className="text-xl font-bold text-[#253D90]">
            Employee Management
          </div>
        </div>

        {/* Right: Note + Button */}
        <div className="flex items-center gap-5">
          <div>
            <div className="text-[#253D90]">Note:</div>
            <div className="text-black">
              Create on boarding form for new employee here
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleClick}
            className="rounded-[15px] bg-[#BDD2E0] text-xl"
          >
            NEW HIRE
          </Button>
        </div>
      </div>
    </>
  );
}
