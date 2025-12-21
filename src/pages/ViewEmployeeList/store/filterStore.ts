import { create } from 'zustand';

interface Filters {
  status: string;
  category: string;
}

interface Employee {
  id: number;
  fullName: string;
  email: string;
  position: string;
  status: string;
  jobLevel: string;
  department: string;
  employmentType: string;
  timeType: string;

  // add other fields as needed
}

interface FilterStore {
  // UI state
  filterOpen: boolean;
  toggleFilter: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  filters: Filters;
  setFilters: (newFilters: Filters) => void;

  currentPage: number;
  setPage: (page: number) => void;

  statusFilters: { [key: string]: boolean };
  toggleStatus: (key: string) => void;

  // DATA
  employees: Employee[];
  loading: boolean;
  error: string | null;

  //Department
  departmentOpen: boolean;
  toggleDepartment: () => void;
  selectedDepartment: string | null;
  setDepartment: (dept: string | null) => void;
  // True-Department
  departments: string[];
  loadingDepartments: boolean;
  errorDepartments: string | null;
  getDepartments: () => string[];

  // Postion
  positionOpen: boolean;
  togglePosition: () => void;
  selectedPosition: string | null;
  setPosition: (pos: string | null) => void;
  positions: string[];
  loadingPositions: boolean;
  errorPositions: string | null;
  getPositions: () => string[];

  // JobLevel
  jobLevelOpen: boolean;
  toggleJobLevel: () => void;
  selectedJobLevel: string | null;
  setJobLevel: (level: string | null) => void;
  getJobLevels: () => string[];

  // Employment Type
  // State
  employmentTypeOpen: boolean;
  toggleEmploymentType: () => void;
  selectedEmploymentType: string | null;
  setEmploymentType: (type: string | null) => void;

  // Getter
  getEmploymentTypes: () => string[];

  // Time Type
  // State
  timeTypeOpen: boolean;
  toggleTimeType: () => void;
  selectedTimeType: string | null;
  setTimeType: (type: string | null) => void;

  // Getter
  getTimeTypes: () => string[];

  // Fetching function
  fetchEmployees: () => Promise<void>;

  // Clear
  clearFilters: () => void;

  // Overview
  // inside useFilterStore
  getTotalEmployees: () => number;
  getManagersCount: () => number;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filterOpen: false,
  toggleFilter: () => set((state) => ({ filterOpen: !state.filterOpen })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  filters: { status: '', category: '' },
  setFilters: (newFilters) => set({ filters: { ...newFilters } }),

  currentPage: 1,
  setPage: (page) => set({ currentPage: page }),

  // Status Checkbox
  statusFilters: {
    active: false,
    inactive: false,
    pending: false,
  },
  toggleStatus: (key) =>
    set((state) => ({
      statusFilters: {
        ...state.statusFilters,
        [key]: !state.statusFilters[key],
      },
    })),

  //Department
  departments: [],
  loadingDepartments: false,
  errorDepartments: null,

  getDepartments: () => {
    const employees = get().employees;
    const depts = Array.from(new Set(employees.map((emp) => emp.department)));
    return depts;
  },
  //Fake
  departmentOpen: false,
  toggleDepartment: () =>
    set((state) => ({ departmentOpen: !state.departmentOpen })),
  selectedDepartment: null,
  setDepartment: (dept) => set({ selectedDepartment: dept }),

  //Position
  positions: [],
  loadingPositions: false,
  errorPositions: null,

  getPositions: () => {
    const employees = get().employees;
    return Array.from(new Set(employees.map((emp) => emp.position)));
  },

  positionOpen: false,
  togglePosition: () => set((state) => ({ positionOpen: !state.positionOpen })),
  selectedPosition: null,
  setPosition: (pos) => set({ selectedPosition: pos }),

  // JobLevel
  jobLevelOpen: false,
  toggleJobLevel: () => set((state) => ({ jobLevelOpen: !state.jobLevelOpen })),
  selectedJobLevel: null,
  setJobLevel: (level) => set({ selectedJobLevel: level }),

  getJobLevels: () => {
    const employees = get().employees;
    return Array.from(new Set(employees.map((emp) => emp.jobLevel)));
  },

  // Employment Type
  employmentTypeOpen: false,
  toggleEmploymentType: () =>
    set((state) => ({ employmentTypeOpen: !state.employmentTypeOpen })),
  selectedEmploymentType: null,
  setEmploymentType: (type) => set({ selectedEmploymentType: type }),

  getEmploymentTypes: () => {
    const employees = get().employees;
    return Array.from(new Set(employees.map((emp) => emp.employmentType)));
  },

  // Time Type
  timeTypeOpen: false,
  toggleTimeType: () => set((state) => ({ timeTypeOpen: !state.timeTypeOpen })),
  selectedTimeType: null,
  setTimeType: (type) => set({ selectedTimeType: type }),

  getTimeTypes: () => {
    const employees = get().employees;
    return Array.from(new Set(employees.map((emp) => emp.timeType)));
  },

  // Employee
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:5188/api/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data: Employee[] = await res.json();
      set({ employees: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // Clear
  clearFilters: () =>
    set(() => ({
      searchQuery: '',
      currentPage: 1,
      statusFilters: {
        active: false,
        inactive: false,
        pending: false,
      },
      selectedDepartment: null,
      departmentOpen: false,
      selectedPosition: null,
      positionOpen: false,
      selectedJobLevel: null,
      jobLevelOpen: false,
      selectedEmploymentType: null,
      employmentTypeOpen: false,
      selectedTimeType: null,
      timeTypeOpen: false,
      filters: { status: '', category: '' },
    })),

  // Overview
  getTotalEmployees: () => {
    return get().employees.length;
  },

  getManagersCount: () => {
    const { employees } = get();
    return 10;
    return employees.filter((emp) =>
      emp.position.toLowerCase().includes('manager'),
    ).length;
  },
}));
