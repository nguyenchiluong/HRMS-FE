// import { useNavigate } from 'react-router-dom';
// import { useEmployeeStore, type Employee } from '@/store/useStore';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';

// Store
import { useFilterStore } from '../store/filterStore';

import List from '../components/EmployeeList';
import Filter from '../components/Filter';
import FilterBox from '../components/FilterBox';
import NavigationBar from '../components/NavigationBar';
import Overview from '../components/Overview';
import SearchBar from '../components/SearchBar';
import TitleBar from '../components/TitleBar';

export default function ViewEmployeeList() {
  const filterOpen = useFilterStore((s) => s.filterOpen);

  return (
    <>
      <div>
        <NavigationBar />
        <TitleBar />
        <Overview />
        <div className="w-4/5 p-4">
          <div className="flex items-center justify-between gap-2">
            <SearchBar />
            <Filter />
          </div>
          {filterOpen && <FilterBox />}
        </div>
        <List />
      </div>
    </>
  );
}
