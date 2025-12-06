import { useFilterStore } from "../store/filterStore";
import { ChevronDown } from "lucide-react";

export default function PositionDropdown() {
  const { selectedPosition, setPosition, positionOpen, togglePosition, getPositions, setPage } = useFilterStore();
  const Positions = getPositions(); // extract unique Positions from employees

  return (
    <div className="relative">
      <button
        onClick={togglePosition}
        className="my-4 px-4 py-2 border shadow rounded hover:bg-gray-100 text-left w-48"
      >
        <span className="flex justify-between">
          {selectedPosition || "Position"}
          <ChevronDown/>
        </span>  
      </button>

      {positionOpen && (
        <ul className="absolute left-0 rounded bg-gray-100 shadow z-10 w-48">
          {Positions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No Positions</li>
          ) : (
            Positions.map((dept) => (
              <li
                key={dept}
                onClick={() => {
                  setPosition(dept)
                  togglePosition();
                  setPage(1);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  selectedPosition === dept ? "font-semibold" : ""
                }`}
              >
                {dept} {selectedPosition === dept && "✓"}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

