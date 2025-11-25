import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeStore, type Employee } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Funnel} from "lucide-react"

function TitleBar() {
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
          className="bg-[#BDD2E0] text-xl"
        >
          NEW HIRE
        </Button>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Total Employees</p>
            <p className='text-black'>500</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>

        {/* Onboarding */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Onboarding Employees</p>
            <p className='text-black'>15</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>


        {/* Resigned */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Resigned Employees</p>
            <p className='text-black'>9</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>

        {/* Managers */}
        <div className="bg-[#E3EDF9] p-5 rounded-[25px] shadow text-xl">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Managers</p>
            <p className='text-black'>35</p>
            <p className='text-[#65686B]'>employees</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("")

  // const handleSearch = () => {
  //   alert(`Searching for: ${query}`);
  // };

  const handleFilter = () => {
    alert("Filter clicked!");
  };
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employee"
          className="bg-[#C4C4C4] bg-opacity-35 w-4/5 rounded px-3 py-2"
        />

        {/* Filter button */}
        <Button
          onClick={handleFilter}
          className="bg-[#E3EDF9] text-black px-4 py-2 rounded text-xl"
        >
          <Funnel/>
          Filter by
        </Button>
      </div>

      {/* Optional: Search button below
      <Button
        onClick={handleSearch}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Search
      </Button> */}
    </div>
  );
}

function ListStatus() {
  return (
		<div className="px-4">
      <div className="flex justify-end">
        <span className="text-sm text-[#73777B]">
          Showing 20/500 rows
        </span>
      </div>
    </div>
  );
}



function List(){
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push(
      <tr className='even:bg-[#E3EDF9] odd:bg-white'>
          <td className="p-2">P010022</td>
          <td className="p-2">Nguyen Tuan Kiet</td>
          <td className="p-2">kiet.nguyen@antman.com.us</td>
          <td className="p-2">Full-stack Engineer</td>
          <td className="p-2">L2-Mid</td>
          <td className="p-2">Online Payment - Asia Area</td>
          <td className="p-2 text-center"><span className='bg-[#3F861E] text-white rounded-[10px] px-7 py-1'>Active</span></td>
          <td className="p-2 text-center font-bold"><button>⋮</button></td>
        </tr>
    );
  }
  return (
    <div className='p-4'>
    <table className='w-full table-fixed text-left'>
      <thead className='bg-[#E3EDF9] text-black font-bold'>
        <tr>
          <th className="p-2">Employee ID</th>
          <th className="p-2">Full Name</th>
          <th className="p-2">Work email</th>
          <th className="p-2">Position</th>
          <th className="p-2">Job Level</th>
          <th className="p-2">Department</th>
          <th className="p-2 text-center">Status</th>
          <th className="p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
    </div>
  );
}

function Pagination() {
  return (
    <div className="p-4 flex justify-end items-center space-x-2">
      <Button 
        variant='ghost'
        className="px-3 py-1 rounded text-[#8C8C8C]">
        Previous
      </Button>
      <Button variant="ghost" className="px-3 py-1 rounded bg-[#E3EDF9]">1</Button>
      <Button variant="ghost" className="px-3 py-1 rounded">2</Button>
      <Button variant="ghost" className="px-3 py-1 rounded">3</Button>
      <Button variant="ghost" className="px-3 py-1 rounded">4</Button>
      <Button variant="ghost" className="px-3 py-1 rounded text-[#253D90]">
        Next
      </Button>
    </div>
  );
}

export default function ViewEmployeeList() {


	return (
		<>
      <div className=''>
        <TitleBar/>
        <Overview/>
        <SearchBar/>
        <ListStatus/>
        <List/>
        <Pagination/>
    </div>
		</>
	)

  };