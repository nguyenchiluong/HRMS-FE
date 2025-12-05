import { useFilterStore } from "../store/filterStore";
// TODO import { ChevronDown } from "lucide-react";
import DepartmentDropdown from "./DepartmentDropDown";
import PositionDropdown from "./PositionDropdown";
import JobLevelDropdown from "./JobLevelDropdown";
import EmploymentTypeDropdown from "./EmploymentTypeDropdown";
import TimeTypeDropdown from "./TimeTypeDropdown";
import ClearFilters from "./ClearButton";





export default function FilterBoxUI() {
  const { statusFilters, toggleStatus } = useFilterStore();
  return (
    <div className="my-4 p-4 rounded-[10px] bg-[#D9D9D9] bg-opacity-35 shadow">
      {/* Employee Status Checkboxes */}

      <div className="flex items-center gap-6 mb-4">
        <span className="font-medium text-[#65686B]">Employee Status</span>
          {Object.keys(statusFilters).map((key) => (
          <label key={key} className="flex items-center space-x-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600"
              checked={statusFilters[key]}
              onChange={() => toggleStatus(key)}
            />
            <span className="capitalize">{key}</span>
          </label>
        ))}
      </div>
      {/* Dropdown Buttons with Chevron */}
      <div className="flex justify-between gap-4 flex-wrap">
        <DepartmentDropdown/>
        <PositionDropdown/>
        <JobLevelDropdown/>
        <EmploymentTypeDropdown/>
        <TimeTypeDropdown/>
      </div>
      
      {/* Setting */}
        <ClearFilters/>
    </div>
  );
}




// export default function FilterBox() {
//   const { selectedDepartment, setDepartment, statusFilters, toggleStatus } = useFilterStore();
//   const [deptOpen, setDeptOpen] = useState(false);
//   const [levelOpen, setLevelOpen] = useState(false);


//   return (
//     <div className="my-4 p-4 rounded-[10px] bg-[#D9D9D9] bg-opacity-35 shadow">
      
//       {/* Status Checkboxes */}
//       <div className="flex items-center gap-20">
//       <span className="font-medium text-[#65686B]">Employee Status</span>
//       {Object.keys(statusFilters).map((key) => (
//         <label key={key} className="flex items-center space-x-1 ">
//           <input
//             type="checkbox"
//             checked={statusFilters[key]}
//             onChange={() => toggleStatus(key)}
//             className="h-4 w-4 text-blue-600"
//           />
//           <span className="capitalize">{key}</span>
//         </label>
//       ))}
//     </div>
      
//       {/* Dropdown */ }
//       <div className="flex">

//         {/* Department Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setDeptOpen(!deptOpen)}
//             className="my-4 px-4 py-2 border rounded hover:bg-gray-100 text-left"
//           >
//             {selectedDepartment || "Select Department"}
//           </button>
//           {deptOpen && (
//             <ul className="absolute left-0 rounded bg-gray-100 shadow">
//               {departments.map((dept) => (
//                 <li
//                   key={dept}
//                   onClick={() => {
//                     setDepartment(dept);
//                     setDeptOpen(false);
//                   }}
//                   className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
//                     selectedDepartment === dept ? "font-semibold" : ""
//                   }`}
//                 >
//                   {dept} {selectedDepartment === dept && "✓"}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Level Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setLevelOpen(!levelOpen)}
//             className="my-2 px-4 py-2 border rounded hover:bg-gray-100 w-full text-left"
//           >
//             { "Select Level"}
//           </button>

//           {/* {levelOpen && (
//             <ul className="absolute left-0 right-0 rounded bg-gray-100 shadow z-10">
//               {levels.map((level) => (
//                 <li
//                   key={level}
//                   onClick={() => {
//                     setFilters({ ...filters, status: level });
//                     setLevelOpen(false);
//                   }}
//                   className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
//                     filters.status === level ? "font-semibold" : ""
//                   }`}
//                 >
//                   {level} {filters.status === level && "✓"}
//                 </li>
//               ))}
//             </ul>
//           )} */}
          
//         </div>
//       </div>

      
//     </div>
  // );
// }