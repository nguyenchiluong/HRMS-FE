import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmployeeTable } from '../components/EmployeeTable';
import { FilterSection } from '../components/FilterSection';
import OnboardEmployeeModal from '../components/OnboardEmployeeModal';
import { StatsCards } from '../components/StatsCards';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStats } from '../hooks/useEmployeeStats';
import { FilterState } from '../types';

export default function EmployeeManagement() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: [],
    department: [],
    position: [],
    jobLevel: [],
    employmentType: [],
    timeType: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  // Fetch employees with React Query
  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
  } = useEmployees({
    filters,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  // Fetch stats with React Query
  const { data: stats, isLoading: isLoadingStats } = useEmployeeStats();

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.searchTerm,
    filters.status,
    filters.department,
    filters.position,
    filters.jobLevel,
    filters.employmentType,
    filters.timeType,
  ]);

  const data = employeesData?.data ?? [];
  const pagination = employeesData?.pagination;
  const isLoading = isLoadingEmployees || isLoadingStats;

  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.pageSize
    : 0;
  const endIndex = pagination
    ? Math.min(startIndex + pagination.pageSize, totalItems)
    : 0;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="mx-auto min-h-screen space-y-8">
      {/* Header */}
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Employee Management</h1>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <span className="text-xs font-semibold italic text-slate-500">
                Note:
              </span>
              <p className="text-xs italic text-slate-500">
                Create on boarding form for new employee here
              </p>
            </div>
            <Button
              className="text-md w-full rounded-full px-8 py-4 shadow-lg sm:w-auto"
              onClick={() => setIsOnboardModalOpen(true)}
            >
              NEW HIRE
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <StatsCards stats={stats ?? null} isLoading={isLoading} />

      {/* Filter Bar */}
      <FilterSection
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
      />

      {/* Data Table */}
      <EmployeeTable data={data} isLoading={isLoading} />

      {/* Footer / Pagination */}
      {!isLoading && totalItems > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t bg-white px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
            {totalItems} results
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-400">
                  {page}
                </span>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Onboard Employee Modal */}
      {isOnboardModalOpen && (
        <OnboardEmployeeModal onClose={() => setIsOnboardModalOpen(false)} />
      )}
    </div>
  );
}
