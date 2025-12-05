import { useEffect } from "react";

import { useFilterStore } from '../store/filterStore';
import Pagination from './Pagination';
export default function List() {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    searchQuery,
    statusFilters,
    selectedDepartment,
    selectedPosition,
    selectedJobLevel,
    selectedEmploymentType,
    selectedTimeType,
    currentPage,
  } = useFilterStore();

  // Fetch data once when component mounts
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Apply search, filters, and pagination
  const filtered = employees
    .filter(emp => emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(emp => {
      const activeStatuses = Object.entries(statusFilters)
        .filter(([_, v]) => v)
        .map(([k]) => k);
      return activeStatuses.length === 0 || activeStatuses.includes(emp.status.toLowerCase());
    })
    .filter(emp => selectedDepartment ? emp.department === selectedDepartment : true)
    .filter(emp => selectedPosition ? emp.position === selectedPosition : true)
    .filter(emp => selectedJobLevel ? emp.jobLevel === selectedJobLevel : true)
    .filter(emp => selectedEmploymentType ? emp.employmentType === selectedEmploymentType : true)
    .filter(emp => selectedTimeType ? emp.timeType === selectedTimeType : true);


  const pageSize = 20;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    
    <div className='p-4'>

      {/*Page Status*/}
      <div className="flex justify-end py-4">
        <span className="text-sm text-[#73777B]">
          Showing {paginated.length} of {filtered.length} rows
        </span>
      </div>

      {/* List */}
      <table className='w-full text-left'>
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
          {paginated.map((emp) => (
            <tr key={emp.id} className="even:bg-[#E3EDF9] odd:bg-white">
              <td className="p-2">{emp.id}</td>
              <td className="p-2">{emp.fullName}</td>
              <td className="p-2">{emp.email.replace(/(.{2}).+(@.+)/, "$1****$2")}</td>
              <td className="p-2">{emp.position}</td>
              <td className="p-2">{emp.jobLevel}</td>
              <td className="p-2">{emp.department}</td>
              <td className="p-2 text-center">
                {emp.status.toLowerCase() === "active" ? (
                  <span className="bg-[#3F861E] text-white rounded-[10px] px-7 py-1 w-28 text-center inline-block">
                    {emp.status}
                  </span>
                ) : emp.status.toLowerCase() === "inactive" ? (
                  <span className="bg-gray-400 text-white rounded-[10px] px-7 py-1 w-28 text-center inline-block">
                    {emp.status}
                  </span>
                ) : (
                  <span className="bg-[#FFC20E] text-black rounded-[10px] px-7 py-1 w-28 text-center inline-block">
                    {emp.status}
                  </span>
                )}
              </td>
              <td className="p-2 text-center font-bold">
                <button>⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination 
        totalItems={filtered.length} 
        pageSize={pageSize} 
      />
    </div>
  );
}

// export default function List(){
//     const [rows, setRows] = useState(() => {
//     const base = [
//         { 
//           id: "P010022", 
//           name: "Nguyen Tuan Kiet", 
//           email: "kiet.nguyen@antman.com.us", 
//           position: "Full-stack Engineer", 
//           level: "L2-Mid", 
//           dept: "Online Payment - Asia Area", 
//           status: "Active" 
//         },
//         { 
//           id: "P010023", 
//           name: "Nguyen Tuan Kiet", 
//           email: "kiet.nguyen@antman.com.us", 
//           position: "Full-stack Engineer", 
//           level: "L2-Mid", 
//           dept: "Online Payment - Asia Area", 
//           status: "Pending" 
//         },
        
//     ];
  
//     return Array.from({ length: 20 }, (_, i) => {
//       return base[i % base.length];
//     });
//   });  
  
//       // <tr className='even:bg-[#E3EDF9] odd:bg-white'>
//       //     <td className="p-2">P010022</td>
//       //     <td className="p-2">Nguyen Tuan Kiet</td>
//       //     <td className="p-2">kiet.nguyen@antman.com.us</td>
//       //     <td className="p-2">Full-stack Engineer</td>
//       //     <td className="p-2">L2-Mid</td>
//       //     <td className="p-2">Online Payment - Asia Area</td>
//       //     <td className="p-2 text-center"><span className='bg-[#3F861E] text-white rounded-[10px] px-7 py-1'>Active</span></td>
//       //     <td className="p-2 text-center font-bold"><button>⋮</button></td>
//       //   </tr>

//   return (
//     <div className='p-4'>
//     <table className='w-full table-fixed text-left'>
//       <thead className='bg-[#E3EDF9] text-black font-bold'>
//         <tr>
//           <th className="p-2">Employee ID</th>
//           <th className="p-2">Full Name</th>
//           <th className="p-2">Work email</th>
//           <th className="p-2">Position</th>
//           <th className="p-2">Job Level</th>
//           <th className="p-2">Department</th>
//           <th className="p-2 text-center">Status</th>
//           <th className="p-2 text-center">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row, index) => (
//           <tr key={index} className='even:bg-[#E3EDF9] odd:bg-white'>
//             <td className="p-2">{row.id}</td>
//             <td className="p-2">{row.name}</td>
//             <td className="p-2">{row.email}</td>
//             <td className="p-2">{row.position}</td>
//             <td className="p-2">{row.level}</td>
//             <td className="p-2">{row.dept}</td>
//             <td className="p-2 text-center">
//               {row.status === "Active" ? (
//                 <span className='bg-[#3F861E] text-white rounded-[10px] px-7 py-1'>{row.status}</span>
//               ) : (
//                 <span className='bg-[#FFC20E] text-black rounded-[10px] px-7 py-1'>{row.status}</span>
//               )}
//             </td>
//             <td className="p-2 text-center font-bold"><button>⋮</button></td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     </div>
//   );
// }