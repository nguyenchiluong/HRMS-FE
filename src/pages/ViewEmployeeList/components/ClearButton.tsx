import { useFilterStore } from "../store/filterStore";

export default function ClearFilters() {
  const { clearFilters } = useFilterStore();

  return (
    <button
      onClick={clearFilters}
      className="px-4 py-2 mt-4 border rounded hover:bg-gray-100"
    >
      Clear
    </button>
  );
}
