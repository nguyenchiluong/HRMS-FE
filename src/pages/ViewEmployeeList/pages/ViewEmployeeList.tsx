// import { useNavigate } from 'react-router-dom';
// import { useEmployeeStore, type Employee } from '@/store/useStore';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';


// Store
import { useFilterStore } from '../store/filterStore';

import NavigationBar from '../components/NavigationBar';
import TitleBar from '../components/TitleBar';
import Overview from '../components/Overview';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';
import FilterBox from '../components/FilterBox';
import List from '../components/EmployeeList';

// Data



















export default function ViewEmployeeList() {
  const filterOpen = useFilterStore((s) => s.filterOpen);

	return (
		<>
      <div>
        <NavigationBar/>
        <TitleBar/>
        <Overview/>
        <div className="p-4 w-4/5">
          <div className="flex items-center gap-2 justify-between">
            <SearchBar/>
            <Filter/>
          </div>
          {filterOpen && <FilterBox/>}
        </div>
        <List/>
    </div>
		</>
	)

  };