import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Filter, Search, X } from 'lucide-react';
import { TeamMembersFilters } from '../types';

interface SearchAndFiltersProps {
  filters: TeamMembersFilters;
  onFiltersChange: (filters: TeamMembersFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function SearchAndFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading,
}: SearchAndFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state with filters prop when it changes externally
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const hasActiveFilters =
    filters.search ||
    filters.department ||
    filters.status ||
    filters.position;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the filter update
    debounceTimerRef.current = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined, page: 1 });
    }, 300); // 300ms debounce
  };

  const handleStatusChange = (status: 'Active' | 'Pending' | 'Inactive') => {
    if (filters.status === status) {
      onFiltersChange({ ...filters, status: undefined, page: 1 });
    } else {
      onFiltersChange({ ...filters, status, page: 1 });
    }
  };

  const handleFilterChange = (
    key: 'department' | 'position',
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Toggle Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full max-w-xl">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Button
          variant="secondary"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            'min-w-[120px]',
            isFilterOpen
              ? 'bg-blue-200 text-blue-800'
              : 'bg-blue-50 text-slate-700'
          )}
        >
          {isFilterOpen ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Filter className="mr-2 h-4 w-4" />
          )}
          Filter by
        </Button>
      </div>

      {/* Collapsible Panel */}
      {isFilterOpen && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm duration-200 animate-in fade-in slide-in-from-top-2">
          {/* Status Row */}
          <div className="mb-6 flex flex-wrap items-center gap-6">
            <span className="mr-2 text-sm font-medium text-slate-600">
              Employee Status
            </span>
            <Checkbox
              label="Active"
              checked={filters.status === 'Active'}
              onChange={() => handleStatusChange('Active')}
            />
            <Checkbox
              label="Pending"
              checked={filters.status === 'Pending'}
              onChange={() => handleStatusChange('Pending')}
            />
            <Checkbox
              label="Inactive"
              checked={filters.status === 'Inactive'}
              onChange={() => handleStatusChange('Inactive')}
            />
          </div>

          {/* Dropdowns Row */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FilterDropdown
              label="Department"
              options={[
                'Engineering',
                'Product',
                'Design',
                'Sales',
                'HR',
                'Marketing',
                'Finance',
              ]}
              selectedValue={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
            <FilterDropdown
              label="Position"
              options={[
                'Software Engineer',
                'Product Manager',
                'Designer',
                'Sales Representative',
                'HR Manager',
                'Marketing Specialist',
                'Finance Analyst',
              ]}
              selectedValue={filters.position}
              onChange={(value) => handleFilterChange('position', value)}
            />
          </div>

          {/* Action Buttons */}
          {hasActiveFilters && (
            <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
              <Button variant="default" onClick={onClearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValue?: string;
  onChange: (value: string | undefined) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options = [],
  selectedValue,
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

  const handleSelect = (option: string) => {
    if (selectedValue === option) {
      onChange(undefined);
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100',
          isOpen || selectedValue
            ? 'border-blue-500 ring-2 ring-blue-100'
            : 'border-gray-300 hover:border-blue-400'
        )}
      >
        <span className="truncate">
          {selectedValue || label}
          {selectedValue && (
            <span className="ml-2 text-xs text-slate-400">({selectedValue})</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-100 bg-white py-1 shadow-lg duration-100 animate-in fade-in zoom-in-95">
          <div
            className={cn(
              'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
              !selectedValue
                ? 'bg-blue-100 font-medium text-blue-900'
                : 'text-slate-700 hover:bg-blue-50'
            )}
            onClick={() => handleSelect('')}
          >
            All {label}
            {!selectedValue && <Check className="h-4 w-4 text-blue-600" />}
          </div>
          {options.length > 0 ? (
            options.map((option, idx) => {
              const isSelected = selectedValue === option;
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
                    isSelected
                      ? 'bg-blue-100 font-medium text-blue-900'
                      : 'text-slate-700 hover:bg-blue-50'
                  )}
                  onClick={() => handleSelect(option)}
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
