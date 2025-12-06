import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          department: 'Engineering',
          position: 'Senior Developer',
          salary: 85000,
          joinDate: '2022-01-15',
          status: 'active',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          department: 'HR',
          position: 'HR Manager',
          salary: 75000,
          joinDate: '2021-06-20',
          status: 'active',
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          department: 'Marketing',
          position: 'Marketing Specialist',
          salary: 65000,
          joinDate: '2023-03-10',
          status: 'active',
        },
      ],
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (id, updatedEmployee) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updatedEmployee } : emp,
          ),
        })),
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
      getEmployeeById: (id) => get().employees.find((emp) => emp.id === id),
    }),
    {
      name: 'employee-storage',
    },
  ),
);
