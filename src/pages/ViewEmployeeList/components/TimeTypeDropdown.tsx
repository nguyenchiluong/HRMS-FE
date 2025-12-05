import { useFilterStore } from "../store/filterStore";
import { ChevronDown } from "lucide-react";

export default function TimeTypeDropdown() {
  const {
    selectedTimeType,
    setTimeType,
    timeTypeOpen,
    toggleTimeType,
    getTimeTypes,
    setPage
  } = useFilterStore();

  const timeTypes = getTimeTypes(); // extract unique time types

  return (
    <div className="relative">
      <button
        onClick={toggleTimeType}
        className="my-4 px-4 py-2 border shadow rounded hover:bg-gray-100 text-left w-48"
      >
        
        <span className="flex justify-between">
          {selectedTimeType || "Time Type"} 
          <ChevronDown/>
        </span>
      </button>

      {timeTypeOpen && (
        <ul className="absolute left-0 rounded bg-gray-100 shadow z-10 w-48">
          {timeTypes.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No types</li>
          ) : (
            timeTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setTimeType(type);
                  setPage(1);             // reset pagination
                  toggleTimeType();       // close dropdown
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  selectedTimeType === type ? "font-semibold" : ""
                }`}
              >
                {type} {selectedTimeType === type && "✓"}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
