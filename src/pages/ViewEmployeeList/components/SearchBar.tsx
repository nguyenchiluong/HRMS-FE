import { useFilterStore } from "../store/filterStore";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, setPage } = useFilterStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // update store
    setPage(1); // reset pagination when searching
  };

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleChange}
      placeholder="Search employee"
      className="bg-[#C4C4C4] bg-opacity-35 w-4/5 rounded px-3 py-2"
    />
  );
}
