import { useFilterStore } from "../store/filterStore";
// TODO
// import { ChevronDown } from "lucide-react";

export default function EmploymentTypeDropdown() {
  const {
    selectedEmploymentType,
    setEmploymentType,
    employmentTypeOpen,
    toggleEmploymentType,
    getEmploymentTypes,
    setPage
  } = useFilterStore();

  const employmentTypes = getEmploymentTypes(); // extract unique employment types

  return (
    <div className="relative">
      <button
        onClick={toggleEmploymentType}
        className="my-4 px-4 py-2 border rounded hover:bg-gray-100 text-left w-48"
      >
        {selectedEmploymentType || "Employment Type"}
      </button>

      {employmentTypeOpen && (
        <ul className="absolute left-0 rounded bg-gray-100 shadow z-10 w-48">
          {employmentTypes.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No types</li>
          ) : (
            employmentTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setEmploymentType(type);
                  setPage(1);             // reset pagination
                  toggleEmploymentType();  // close dropdown
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  selectedEmploymentType === type ? "font-semibold" : ""
                }`}
              >
                {type} {selectedEmploymentType === type && "✓"}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
