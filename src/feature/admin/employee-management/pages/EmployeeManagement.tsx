import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { EmployeeTable } from '../components/EmployeeTable';
import { FilterSection } from '../components/FilterSection';
import OnboardEmployeeModal from '../components/OnboardEmployeeModal';
import { StatsCards } from '../components/StatsCards';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { FilterState } from '../types';

export default function EmployeeManagement() {
  const {
    employees: data,
    stats,
    isLoading,
    fetchEmployees,
  } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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
  const itemsPerPage = 14; // Matches the long list in screenshot

  // Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((emp) => {
      // Search
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.workEmail.toLowerCase().includes(searchLower) ||
        emp.id.toLowerCase().includes(searchLower);

      // Status
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(emp.status);

      // Multi-select Filters
      const matchesDepartment =
        filters.department.length === 0 ||
        filters.department.includes(emp.department);
      const matchesPosition =
        filters.position.length === 0 ||
        filters.position.includes(emp.position);
      const matchesJobLevel =
        filters.jobLevel.length === 0 ||
        filters.jobLevel.includes(emp.jobLevel);
      const matchesEmployment =
        filters.employmentType.length === 0 ||
        filters.employmentType.includes(emp.employmentType);
      const matchesTimeType =
        filters.timeType.length === 0 ||
        filters.timeType.includes(emp.timeType);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesPosition &&
        matchesJobLevel &&
        matchesEmployment &&
        matchesTimeType
      );
    });
  }, [data, filters]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Filter Bar */}
      <FilterSection
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
      />

      {/* Data Table */}
      <div className="mb-4 text-right">
        <span className="text-sm text-slate-500">
          Showing {currentData.length}/{stats?.total ?? 0} rows
        </span>
      </div>

      <EmployeeTable data={currentData} isLoading={isLoading} />

      {/* Footer / Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="mt-6 flex items-center justify-end gap-2">
          <span className="font-regular ml-2 cursor-pointer text-sm hover:underline">
            Previous
          </span>

          {[...Array(Math.min(4, totalPages))].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
                  currentPage === pageNum
                    ? 'bg-black-100 text-black-700 font-bold'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <span className="font-regular ml-2 cursor-pointer text-sm hover:underline">
            Next
          </span>
        </div>
      )}

      {/* Onboard Employee Modal */}
      {isOnboardModalOpen && (
        <OnboardEmployeeModal onClose={() => setIsOnboardModalOpen(false)} />
      )}
    </div>
  );
}
