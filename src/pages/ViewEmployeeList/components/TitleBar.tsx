import { Users} from "lucide-react"
import { Button } from '@/components/ui/button';

export default function TitleBar() {
	const handleClick = () => {
    alert("Button clicked!");
  }; 

  return (
		<div className="flex items-center justify-between bg-white p-4 space-x-2">
      {/* Left: Title */}
      <div className="flex items-center space-x-2">
        <Users/>
        <div className="font-bold text-[#253D90] text-xl">Employee Management</div>
      </div>

      {/* Right: Note + Button */}
      <div className="flex items-center gap-5">
        <div>
          <div className="text-[#253D90]">Note:</div>
          <div className="text-black">Create on boarding form for new employee here</div>
        </div>
        <Button
          variant="ghost"
          onClick={handleClick}
          className="bg-[#BDD2E0] text-xl rounded-[15px]"
        >
          NEW HIRE
        </Button>
      </div>
    </div>
  );
}