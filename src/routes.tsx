import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import Placeholder from './components/Placeholder';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import AdminLayout from './layout/AdminLayout';
import EmployeeLayout from './layout/EmployeeLayout';
import EditPersonalInfo from './pages/employeeProfileManagement/pages/EditPersonalInfo';

const Login = lazy(() => import('@/feature/shared/auth/pages/Login'));
const Dashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

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
  () => import('./pages/employeeProfileManagement/pages/EmployeeEducation'),
);
const Financial = lazy(
  () => import('./pages/employeeProfileManagement/pages/Financial'),
);
const JobDetails = lazy(
  () => import('./pages/employeeProfileManagement/pages/JobDetails'),
);
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'));
const CreateCampaign = lazy(() => import('@/pages/CreateCampaign'));

const EmployeeManagement = lazy(
  () => import('@/feature/admin/employee-management/pages/EmployeeManagement'),
);

// Profile Change Requests
const ProfileChangeRequests = lazy(
  () => import('@/feature/admin/profile-requests/pages/ProfileChangeRequests'),
);

const EmployeeHome = lazy(
  () => import('@/feature/employee/homepage/pages/EmployeeHome'),
);

const Timesheet = lazy(
  () => import('@/feature/employee/time-management/pages/Timesheet'),
);

const TimeOffRequests = lazy(
  () => import('@/feature/employee/time-management/pages/TimeOffRequests'),
);

const MyAttendance = lazy(
  () => import('@/feature/employee/time-management/pages/MyAttendance'),
);

const AccountSettings = lazy(
  () => import('@/feature/shared/account-settings/pages/AccountSettings'),
);

const NotificationsPage = lazy(
  () => import('@/feature/shared/notifications/pages/NotificationsPage'),
);

const NotificationDetailPage = lazy(
  () => import('@/feature/shared/notifications/pages/NotificationDetailPage'),
);

const TimeLayout = lazy(
  () => import('@/feature/employee/time-management/layout/TimeLayout'),
);

// Approve Requests
const ApproveRequestsLayout = lazy(
  () =>
    import('@/feature/employee/approve-requests/layout/ApproveRequestsLayout'),
);
const ApproveTimesheet = lazy(
  () => import('@/feature/employee/approve-requests/pages/ApproveTimesheet'),
);
const ApproveTimeOff = lazy(
  () => import('@/feature/employee/approve-requests/pages/ApproveTimeOff'),
);

const EmployeeOnboarding = lazy(
  () => import('@/feature/employee/onboarding/pages/EmployeeOnboarding'),
);
const OnboardingSuccess = lazy(
  () => import('@/feature/employee/onboarding/pages/OnboardingSuccess'),
);

// Bonus Management

const BonusSettings = lazy(
  () => import('./pages/AdminBonusSettings/BonusSettings'),
);

const routes: RouteObject[] = [
  // =================================================================
  // 0. Token-based Routes (Accessible by anyone with valid token)
  // =================================================================
  {
    path: '/onboarding',
    element: <EmployeeOnboarding />,
  },
  {
    path: '/onboarding/success',
    element: <OnboardingSuccess />,
  },

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
      // Test
      {
        path: '/test',
        element: <BonusSettings />,
      },
    ],
  },

  // =================================================================
  // 2. Protected Routes (Only accessible when Logged in)
  // =================================================================
  {
    element: <ProtectedRoute />,
    children: [
      // A. Root Redirect Logic (role-based)
      { path: '/', element: <RoleBasedRedirect /> },

      // B. Employee Routes
      {
        path: '/employee',
        element: <EmployeeLayout />,
        children: [
          // Employee Dashboard/Home
          { index: true, element: <EmployeeHome /> },
          { path: 'dashboard', element: <EmployeeHome /> },
          // Time Management Routes
          {
            path: 'time',
            element: <TimeLayout />,
            children: [
              { index: true, element: <MyAttendance /> },
              {
                path: 'attendance',
                element: <MyAttendance />,
              },
              { path: 'timesheet', element: <Timesheet /> },
              {
                path: 'my-requests',
                element: <TimeOffRequests />,
              },
            ],
          },
          // Approve Requests Routes
          {
            path: 'approve-requests',
            element: <ApproveRequestsLayout />,
            children: [
              { index: true, element: <Navigate to="timesheet" replace /> },
              { path: 'timesheet', element: <ApproveTimesheet /> },
              { path: 'time-off', element: <ApproveTimeOff /> },
            ],
          },
          {
            path: 'profile',
            children: [
              { index: true, element: <Navigate to="ids" replace /> },
              {
                path: 'personal-info',
                children: [
                  { index: true, element: <PersonalInfo /> },
                  {
                    path: 'edit',
                    element: <EditPersonalInfo />,
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
                  { path: 'edit', element: <EmployeeEditIDs /> },
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
          { path: 'settings', element: <AccountSettings /> },
          {
            path: 'notifications',
            children: [
              { index: true, element: <NotificationsPage /> },
              { path: ':id', element: <NotificationDetailPage /> },
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
          { path: 'employees', element: <EmployeeManagement /> }, // /admin/employees
          { path: 'add-employee', element: <AddEmployee /> }, // /admin/add-employee

          // Auth Actions
          { path: 'logout', element: <Placeholder title="Logout Logic" /> },
          {
            path: 'change-password',
            element: <Placeholder title="Change Password" />,
          },
          { path: 'settings', element: <AccountSettings /> },
          {
            path: 'notifications',
            children: [
              { index: true, element: <NotificationsPage /> },
              { path: ':id', element: <NotificationDetailPage /> },
            ],
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
                element: <ProfileChangeRequests />,
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
            path: 'bonus',
            children: [
              { index: true, element: <BonusSettings /> },
              // { path: 'new', element: <CreateCampaign /> },
            ],
          },
        ],
      },

      { path: '/settings', element: <Placeholder title="Settings" /> },
      { path: '/help', element: <Placeholder title="Help Center" /> },
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
