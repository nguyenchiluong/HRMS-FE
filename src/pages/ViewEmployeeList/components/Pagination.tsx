import { Button } from '@/components/ui/button';
import { useFilterStore } from '../store/filterStore';

interface Props {
  totalItems: number; // total filtered employees
  pageSize: number;   // items per page
}

export default function Pagination({ totalItems, pageSize }: Props) {
  const { currentPage, setPage } = useFilterStore();
  const totalPages = Math.ceil(totalItems / pageSize);

//   if (totalPages <= 1) return null; // hide if only one page

  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 flex justify-end items-center space-x-2">
      <Button
        variant="ghost"
        className="px-3 py-1 rounded text-[#8C8C8C]"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant="ghost"
          className={`px-3 py-1 rounded ${p === currentPage ? 'bg-[#E3EDF9]' : ''}`}
          onClick={() => handleClick(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="ghost"
        className="px-3 py-1 rounded text-[#253D90]"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
