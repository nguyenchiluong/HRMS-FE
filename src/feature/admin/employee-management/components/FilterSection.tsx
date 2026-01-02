import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Filter, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { useEmploymentTypes } from '../hooks/useEmploymentTypes';
import { useJobLevels } from '../hooks/useJobLevels';
import { usePositions } from '../hooks/usePositions';
import { useTimeTypes } from '../hooks/useTimeTypes';
import { EmployeeStatus, FilterState } from '../types';
import { Input } from './ui/Input';

interface FilterSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  setFilters,
  isOpen,
  setIsOpen,
}) => {
  // Fetch all filter options from backend
  const { data: departmentsData = [] } = useDepartments();
  const { data: positionsData = [] } = usePositions();
  const { data: jobLevelsData = [] } = useJobLevels();
  const { data: employmentTypesData = [] } = useEmploymentTypes();
  const { data: timeTypesData = [] } = useTimeTypes();

  // Map to string arrays for filter dropdowns
  const departments = useMemo(
    () => departmentsData.map((dept) => dept.name),
    [departmentsData],
  );
  const positions = useMemo(
    () => positionsData.map((pos) => pos.title),
    [positionsData],
  );
  const jobLevels = useMemo(
    () => jobLevelsData.map((level) => level.name),
    [jobLevelsData],
  );
  const employmentTypes = useMemo(
    () => employmentTypesData.map((type) => type.name),
    [employmentTypesData],
  );
  const timeTypes = useMemo(
    () => timeTypesData.map((type) => type.name),
    [timeTypesData],
  );

  const handleStatusChange = (status: EmployeeStatus) => {
    setFilters((prev) => {
      const currentStatuses = prev.status;
      if (currentStatuses.includes(status)) {
        return { ...prev, status: currentStatuses.filter((s) => s !== status) };
      } else {
        return { ...prev, status: [...currentStatuses, status] };
      }
    });
  };

  const handleClear = () => {
    setFilters({
      searchTerm: '',
      status: [],
      department: [],
      position: [],
      jobLevel: [],
      employmentType: [],
      timeType: [],
    });
  };

  const updateFilter = (key: keyof FilterState, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Toggle Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Input
          placeholder="Search employee"
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
          icon={<Search className="h-4 w-4" />}
          className="border-1 max-w-xl bg-gray-100 px-4 py-2 focus:bg-white focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        />

        <Button
          variant={isOpen ? 'secondary' : 'secondary'}
          onClick={() => setIsOpen(!isOpen)}
          className={`min-w-[120px] ${isOpen ? 'bg-blue-200 text-blue-800' : 'bg-blue-50 text-slate-700'}`}
        >
          {isOpen ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Filter className="mr-2 h-4 w-4" />
          )}
          Filter by
        </Button>
      </div>

      {/* Collapsible Panel */}
      {isOpen && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm duration-200 animate-in fade-in slide-in-from-top-2">
          {/* Status Row */}
          <div className="mb-6 flex flex-wrap items-center gap-6">
            <span className="mr-2 text-sm font-medium text-slate-600">
              Employee Status
            </span>
            <Checkbox
              label="Active"
              checked={filters.status.includes(EmployeeStatus.Active)}
              onChange={() => handleStatusChange(EmployeeStatus.Active)}
            />
            <Checkbox
              label="Pending"
              checked={filters.status.includes(EmployeeStatus.Pending)}
              onChange={() => handleStatusChange(EmployeeStatus.Pending)}
            />
            <Checkbox
              label="Inactive"
              checked={filters.status.includes(EmployeeStatus.Inactive)}
              onChange={() => handleStatusChange(EmployeeStatus.Inactive)}
            />
          </div>

          {/* Dropdowns Row - Visual Only for this Demo */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterDropdown
              label="Department"
              options={departments}
              selectedValues={filters.department}
              onChange={(vals) => updateFilter('department', vals)}
            />
            <FilterDropdown
              label="Position"
              options={positions}
              selectedValues={filters.position}
              onChange={(vals) => updateFilter('position', vals)}
            />
            <FilterDropdown
              label="Job Level"
              options={jobLevels}
              selectedValues={filters.jobLevel}
              onChange={(vals) => updateFilter('jobLevel', vals)}
            />
            <FilterDropdown
              label="Employment Type"
              options={employmentTypes}
              selectedValues={filters.employmentType}
              onChange={(vals) => updateFilter('employmentType', vals)}
            />
            <FilterDropdown
              label="Time Type"
              options={timeTypes}
              selectedValues={filters.timeType}
              onChange={(vals) => updateFilter('timeType', vals)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
            <Button variant="default" onClick={handleClear}>
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options = [],
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100',
          isOpen || selectedValues.length > 0
            ? 'border-blue-500 ring-2 ring-blue-100'
            : 'border-gray-300 hover:border-blue-400',
        )}
      >
        <span className="truncate">
          {label}{' '}
          {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}
        </span>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-100 bg-white py-1 shadow-lg duration-100 animate-in fade-in zoom-in-95">
          {options.length > 0 ? (
            options.map((option, idx) => {
              const isSelected = selectedValues.includes(option);
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
                    isSelected
                      ? 'bg-blue-100 font-medium text-blue-900'
                      : 'text-slate-700 hover:bg-blue-50',
                  )}
                  onClick={() => toggleOption(option)}
                >
                  {option}
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm italic text-slate-400">
              No options
            </div>
          )}
        </div>
      )}
    </div>
  );
};
