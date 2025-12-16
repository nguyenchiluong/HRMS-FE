import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import Placeholder from './components/Placeholder';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminLayout from './layout/AdminLayout';
import EmployeeLayout from './layout/EmployeeLayout';
import BonusCreditPage from './pages/AdminBonusSettings/BonusSettings';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

// Employee Management (Legacy)
const Employees = lazy(
  () => import('@/pages/ViewEmployeeList/pages/ViewEmployeeList'),
); // Path UPDATED
const AddEmployee = lazy(() => import('@/pages/admin/AddEmployee'));

// Profile Management
const EmployeeIDs = lazy(
  () => import('./pages/employeeProfileManagement/pages/EmployeeIDs'),
);
const EmployeeEditIDs = lazy(
  () => import('./pages/employeeProfileManagement/pages/EmployeeEditID'),
);
const PersonalInfo = lazy(
  () => import('./pages/employeeProfileManagement/pages/PersonalInfo'),
);
const Education = lazy(
  () => import('./pages/employeeProfileManagement/pages/Education'),
);
const Financial = lazy(
  () => import('./pages/employeeProfileManagement/pages/Financial'),
);
const JobDetails = lazy(
  () => import('./pages/employeeProfileManagement/pages/JobDetails'),
);
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'));
const CreateCampaign = lazy(() => import('@/pages/CreateCampaign'));

// Bonus Management 

const BonusSettings = lazy(
  () => import('./pages/AdminBonusSettings/BonusSettings')
);

const routes: RouteObject[] = [
  // =================================================================
  // 1. Public Routes (Only accessible when NOT logged in)
  // =================================================================
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <Login /> },
      {
        path: '/forgot-password',
        element: <Placeholder title="Forgot Password" />,
      },
      {
        path: '/reset-password/:token',
        element: <Placeholder title="Reset Password" />,
      },
      {
        path: '/onboarding/:token',
        element: <Placeholder title="Onboarding" />,
      },
    ],
  },

  // =================================================================
  // 2. Protected Routes (Only accessible when Logged in)
  // =================================================================
  {
    element: <ProtectedRoute />,
    children: [
      // A. Root Redirect Logic
      // If a logged-in user hits '/', send them to the admin dashboard (or employee dashboard)
      { path: '/', element: <Navigate to="/admin" replace /> },

      // B. Employee Routes
      {
        path: '/employee',
        element: <EmployeeLayout />,
        children: [
          {
            path: 'profile',
            children: [
              { index: true, element: <EmployeeIDs /> },
              { path: 'edit', element: <EmployeeEditIDs /> },
              {
                path: 'personal-info',
                children: [
                  { index: true, element: <PersonalInfo /> },
                  {
                    path: 'edit',
                    element: <Placeholder title="Edit Personal Info" />,
                  },
                  {
                    path: 'contact',
                    element: <Placeholder title="Contact Info" />,
                  },
                  {
                    path: 'emergency',
                    element: <Placeholder title="Emergency Info" />,
                  },
                  {
                    path: 'family',
                    element: <Placeholder title="Family Info" />,
                  },
                ],
              },
              { path: 'education', element: <Education /> },
              { path: 'financial', element: <Financial /> },
              {
                path: 'ids',
                children: [
                  { index: true, element: <EmployeeIDs /> },
                  {
                    path: 'request-update',
                    element: <Placeholder title="Request ID Update" />,
                  },
                ],
              },
              {
                path: 'change-requests',
                element: <Placeholder title="Profile Change Requests" />,
              },
              { path: 'job-details', element: <JobDetails /> },
            ],
          },
          // ... (Rest of Employee Sub-routes kept as is, just ensured nesting)
          {
            path: 'requests',
            children: [
              { index: true, element: <Placeholder title="My Requests" /> },
              // ...
            ],
          },
        ],
      },

      // C. Admin Routes
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          // 1. Dashboard is the index of /admin
          { index: true, element: <Dashboard /> },

          // 2. IMPORTANT: Removed the conflicting redirect here that was sending /admin/dashboard back to /

          {
            path: 'dashboard/employee',
            element: <Placeholder title="Employee Dashboard" />,
          },
          {
            path: 'dashboard/manager',
            element: <Placeholder title="Manager Dashboard" />,
          },
          {
            path: 'dashboard/admin',
            element: <Placeholder title="Admin Dashboard" />,
          },

          // Legacy Routes
          { path: 'employees', element: <Employees /> }, // /admin/employees
          { path: 'add-employee', element: <AddEmployee /> }, // /admin/add-employee

          // Auth Actions
          { path: 'logout', element: <Placeholder title="Logout Logic" /> },
          {
            path: 'change-password',
            element: <Placeholder title="Change Password" />,
          },

          // Nested Admin Features
          {
            path: 'employees-management', // Renamed to avoid conflict with legacy 'employees' above if needed
            children: [
              {
                index: true,
                element: <Placeholder title="Admin Employees List" />,
              },
              { path: 'new', element: <Placeholder title="New Employee" /> },
              { path: 'bulk', element: <Placeholder title="Bulk Upload" /> },
              {
                path: 'pending',
                element: <Placeholder title="Pending Employees" />,
              },
              {
                path: 'inactive',
                element: <Placeholder title="Inactive Employees" />,
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    element: <Placeholder title="Employee Detail" />,
                  },
                  {
                    path: 'edit',
                    element: <Placeholder title="Edit Employee" />,
                  },
                  {
                    path: 'deactivate',
                    element: <Placeholder title="Deactivate Employee" />,
                  },
                  {
                    path: 'reactivate',
                    element: <Placeholder title="Reactivate Employee" />,
                  },
                ],
              },
            ],
          },
          {
            path: 'profile-requests',
            children: [
              {
                index: true,
                element: <Placeholder title="Profile Requests" />,
              },
              { path: ':id', element: <Placeholder title="Request Detail" /> },
            ],
          },
          {
            path: 'activities',
            children: [
              { index: true, element: <Placeholder title="Activities List" /> },
            ],
          },
          {
            path: 'campaigns',
            children: [
              { index: true, element: <CampaignsPage /> },
              { path: 'new', element: <CreateCampaign /> },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    element: <Placeholder title="Campaign Detail" />,
                  },
                  {
                    path: 'edit',
                    element: <Placeholder title="Edit Campaign" />,
                  },
                  {
                    path: 'registrations',
                    element: <Placeholder title="Campaign Registrations" />,
                  },
                  {
                    path: 'leaderboard',
                    element: <Placeholder title="Leaderboard" />,
                  },
                ],
              },
            ],
          },
          {
            path: 'credit',
            children: [
              { index: true, element: <BonusSettings /> },
              // { path: 'new', element: <CreateCampaign /> },
            ]
          }
        ],
      },

      { path: '/settings', element: <Placeholder title="Settings" /> },
      { path: '/help', element: <Placeholder title="Help Center" /> },
      {
        path: '/notifications',
        element: <Placeholder title="Notifications" />,
      },
    ],
  },

  // =================================================================
  // 3. System & Error Routes
  // =================================================================
  { path: '/404', element: <Placeholder title="404 Not Found" /> },
  { path: '/403', element: <Placeholder title="403 Forbidden" /> },
  { path: '/500', element: <Placeholder title="500 Server Error" /> },
  { path: '/unauthorized', element: <Placeholder title="Unauthorized" /> },

  // Catch all - redirect to 404
  { path: '*', element: <Navigate to="/404" replace /> },
];

export const Router = createBrowserRouter(routes);
