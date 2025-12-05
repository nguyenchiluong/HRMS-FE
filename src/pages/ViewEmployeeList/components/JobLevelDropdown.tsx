import { useFilterStore } from "../store/filterStore";
// TODO import { ChevronDown } from "lucide-react";

export default function JobLevelDropdown() {
  const {
    selectedJobLevel,
    setJobLevel,
    jobLevelOpen,
    toggleJobLevel,
    getJobLevels,
    setPage
  } = useFilterStore();

  const jobLevels = getJobLevels(); // extract unique job levels

  return (
    <div className="relative">
      <button
        onClick={toggleJobLevel}
        className="my-4 px-4 py-2 border rounded hover:bg-gray-100 text-left w-48"
      >
        {selectedJobLevel || "Job Level"}
      </button>

      {jobLevelOpen && (
        <ul className="absolute left-0 rounded bg-gray-100 shadow z-10 w-48">
          {jobLevels.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No job levels</li>
          ) : (
            jobLevels.map((level) => (
              <li
                key={level}
                onClick={() => {
                  setJobLevel(level);
                  setPage(1);       // reset pagination
                  toggleJobLevel(); // close dropdown
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  selectedJobLevel === level ? "font-semibold" : ""
                }`}
              >
                {level} {selectedJobLevel === level && "✓"}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
