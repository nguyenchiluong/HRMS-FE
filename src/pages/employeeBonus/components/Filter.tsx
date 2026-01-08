import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Filter as FilterIcon, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { subDays, startOfMonth } from "date-fns";
import { toDateString } from "../utils/dateFormatters";
import { TransactionType } from "../types/transaction";
import { TRANSACTION_META } from "../constants/transactionMeta";

interface FilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  isInvalidRange: boolean;
  selectedTypes: TransactionType[];
  onTypesChange: (types: TransactionType[]) => void;
  inline?: boolean; // render compact with no outer margin for inline layouts
  forceOpen?: boolean; // externally control open state
  hideToggle?: boolean; // hide internal toggle button (useful when controlled externally)
  availableTypes?: TransactionType[]; // limit which types can be selected
}

export function Filter({
  from,
  to,
  onFromChange,
  onToChange,
  isInvalidRange,
  selectedTypes,
  onTypesChange,
  inline = false,
  forceOpen,
  hideToggle,
  availableTypes,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();

  const allTypes: TransactionType[] = [
    "MONTHLY",
    "AWARD",
    "TRANSFER_RECEIVED",
    "TRANSFER_SENT",
    "REDEEM",
    "DEDUCT",
  ];

  // Use availableTypes if provided, otherwise use all types
  const displayTypes = availableTypes || allTypes;

  const handleClear = () => {
    onFromChange(toDateString(subDays(today, 30)));
    onToChange(toDateString(today));
    onTypesChange([]);
  };

  const handleLast7Days = () => {
    onFromChange(toDateString(subDays(today, 7)));
    onToChange(toDateString(today));
  };

  const handleLast30Days = () => {
    onFromChange(toDateString(subDays(today, 30)));
    onToChange(toDateString(today));
  };

  const handleThisMonth = () => {
    onFromChange(toDateString(startOfMonth(today)));
    onToChange(toDateString(today));
  };

  // Check if filters are different from default (all types, no date range)
  const hasActiveFilters = from || to || selectedTypes.length < displayTypes.length;

  const transactionTypeOptions = displayTypes.map((type) => TRANSACTION_META[type].label);

  const effectiveOpen = forceOpen ?? isOpen;

  return (
    <div className={inline ? "space-y-3" : "mb-6 space-y-4"}>
      {/* Filter Toggle Button */}
      {!hideToggle && (
        <div className={inline ? "flex justify-start" : "flex justify-end"}>
          <Button
            variant={effectiveOpen ? "secondary" : "secondary"}
            onClick={() => setIsOpen(!isOpen)}
            className={`min-w-[120px] ${effectiveOpen
              ? "bg-blue-200 text-blue-800"
              : "bg-blue-50 text-slate-700"
              }`}
          >
            {effectiveOpen ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <FilterIcon className="mr-2 h-4 w-4" />
            )}
            Filter by
          </Button>
        </div>
      )}

      {/* Collapsible Panel */}
      {effectiveOpen && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm duration-200 animate-in fade-in slide-in-from-top-2">
          {/* Preset Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLast7Days}
              className="border-gray-300"
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLast30Days}
              className="border-gray-300"
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleThisMonth}
              className="border-gray-300"
            >
              This month
            </Button>
          </div>

          {/* Custom Date Range */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600">From</label>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => onFromChange(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600">To</label>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => onToChange(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {isInvalidRange && (
            <p className="mb-6 text-sm text-red-500">
              "From" date cannot be after "To" date
            </p>
          )}

          {/* Transaction Type Dropdown */}
          <div className="mb-6 grid grid-cols-1 gap-4">
            <FilterDropdown
              label="Transaction Type"
              options={transactionTypeOptions}
              selectedValues={selectedTypes.map((type) => TRANSACTION_META[type].label)}
              onChange={(labels) => {
                const types = displayTypes.filter((type) =>
                  labels.includes(TRANSACTION_META[type].label)
                );
                onTypesChange(types);
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
            <Button
              variant="default"
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100",
          isOpen || selectedValues.length > 0
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-300 hover:border-blue-400"
        )}
      >
        <span className="truncate">
          {label}{" "}
          {selectedValues.length > 0 ? `(${selectedValues.length})` : ""}
        </span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
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
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors",
                    isSelected
                      ? "bg-blue-100 font-medium text-blue-900"
                      : "text-slate-700 hover:bg-blue-50"
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
