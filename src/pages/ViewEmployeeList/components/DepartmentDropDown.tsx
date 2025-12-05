import { useFilterStore } from "../store/filterStore";
//TODO 
// import { ChevronDown } from "lucide-react";

export default function DepartmentDropdown() {
  const { selectedDepartment, setDepartment, departmentOpen, toggleDepartment, getDepartments, setPage } = useFilterStore();
  const departments = getDepartments(); // extract unique departments from employees

  return (
    <div className="relative">
      <button
        onClick={toggleDepartment}
        className="my-4 px-4 py-2 border rounded hover:bg-gray-100 text-left w-48"
      >
        {selectedDepartment || "Department"}  
      </button>

      {departmentOpen && (
        <ul className="absolute left-0 rounded bg-gray-100 shadow z-10 w-48">
          {departments.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No departments</li>
          ) : (
            departments.map((dept) => (
              <li
                key={dept}
                onClick={() => {
                  toggleDepartment();
                  setDepartment(dept);
                  setPage(1);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  selectedDepartment === dept ? "font-semibold" : ""
                }`}
              >
                {dept} {selectedDepartment === dept && "✓"}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

