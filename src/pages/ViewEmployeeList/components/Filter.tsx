import { Button } from '@/components/ui/button';
import { Funnel, FunnelX} from "lucide-react";
import { useFilterStore } from '../store/filterStore';


export default function Filter() {
  // store
  const filterOpen = useFilterStore((s) => s.filterOpen);
  const toggleFilter = useFilterStore((s) => s.toggleFilter);


  // Filter box



  return (
    <>
      {/* Filter button */}
            <Button
              onClick={toggleFilter}
              className="bg-[#E3EDF9] rounded text-xl text-black px-4 py-2"
            >
              {filterOpen ? <FunnelX/> : <Funnel/>}
              Filter by
            </Button>
    </>
  );
}
