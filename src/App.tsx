import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Employees from '@/pages/Employees';
import AddEmployee from '@/pages/AddEmployee';
import CreateCampaign from '@/pages/CreateCampaign';
import ToastProvider from '@/components/ToastProvider';
import EmployeeIDs from './pages/employeeProfileManagement/pages/EmployeeIDs';
import PersonalInfo from './pages/employeeProfileManagement/pages/PersonalInfo';
import Education from './pages/employeeProfileManagement/pages/Education';
import Financial from './pages/employeeProfileManagement/pages/Financial';
import JobDetails from './pages/employeeProfileManagement/pages/JobDetails';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ToastProvider />
      <Routes>
        {/* ==================== Authentication & Onboarding Routes ==================== */}
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot-password" />
        <Route path="/reset-password/:token" />
        <Route path="/onboarding/:token" />

        {/* Protected Routes */}
        <Route path="/logout" />
        <Route path="/change-password" />

        {/* ==================== Employee Profile Management Routes ==================== */}
        {/* Employee Routes (Self-Profile Management) */}
        <Route path="/profile" element={<EmployeeIDs />} />
        <Route path="/profile/personal-info" element={<PersonalInfo />} />
        <Route path="/profile/personal-info/edit" />
        <Route path="/profile/personal-info/contact" />
        <Route path="/profile/personal-info/emergency" />
        <Route path="/profile/personal-info/family" />
        <Route path="/profile/education" element={<Education />} />
        <Route path="/profile/financial" element={<Financial />} />
        <Route path="/profile/ids" element={<EmployeeIDs />} />
        <Route path="/profile/ids/request-update" />
        <Route path="/profile/change-requests" />
        <Route path="/profile/job-details" element={<JobDetails />} />

        {/* Admin Routes */}
        <Route path="/admin/employees" />
        <Route path="/admin/employees/new" />
        <Route path="/admin/employees/bulk" />
        <Route path="/admin/employees/:id" />
        <Route path="/admin/employees/:id/edit" />
        <Route path="/admin/employees/:id/deactivate" />
        <Route path="/admin/employees/:id/reactivate" />
        <Route path="/admin/employees/pending" />
        <Route path="/admin/employees/inactive" />

        {/* Profile Update Requests (Admin) */}
        <Route path="/admin/profile-requests" />
        <Route path="/admin/profile-requests/:id" />

        {/* ==================== Employee Requests Management Routes ==================== */}
        {/* Employee Routes */}
        <Route path="/requests" />
        <Route path="/requests/new" />
        <Route path="/requests/:id" />
        <Route path="/requests/:id/edit" />
        <Route path="/requests/:id/cancel" />

        {/* Attendance Routes (Employee) */}
        <Route path="/attendance" />
        <Route path="/attendance/history" />
        <Route path="/attendance/timesheet" />
        <Route path="/attendance/timesheet/correct" />

        {/* Manager Routes */}
        <Route path="/manager/requests" />
        <Route path="/manager/requests/:id" />
        <Route path="/manager/requests/pending" />
        <Route path="/manager/requests/history" />
        <Route path="/manager/dashboard/requests" />

        {/* ==================== Employee Activities & Campaigns Management Routes ==================== */}
        {/* Manager/Admin Routes (Campaign Management) */}
        <Route path="/campaigns" />
        <Route path="/campaigns/new" element={
          <ProtectedRoute>
            <Layout>
              <CreateCampaign />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/:id" />
        <Route path="/campaigns/:id/edit" />
        <Route path="/campaigns/:id/publish" />
        <Route path="/campaigns/:id/close" />
        <Route path="/campaigns/:id/delete" />
        <Route path="/campaigns/:id/registrations" />

        {/* Activity Approval Routes (Manager) */}
        <Route path="/activities" />
        <Route path="/activities/pending" />
        <Route path="/activities/:id" />
        <Route path="/activities/:id/approve" />
        <Route path="/activities/:id/reject" />
        <Route path="/activities/history" />

        {/* Employee Routes (Campaign Participation) */}
        <Route path="/campaigns/active" />
        <Route path="/campaigns/my-campaigns" />
        <Route path="/campaigns/:id/register" />
        <Route path="/campaigns/:id/unregister" />
        <Route path="/my-activities" />
        <Route path="/my-activities/new" />
        <Route path="/my-activities/:id" />
        <Route path="/my-activities/:id/edit" />
        <Route path="/my-activities/:id/delete" />

        {/* Leaderboard Routes */}
        <Route path="/leaderboard/:campaignId" />
        <Route path="/leaderboard/:campaignId/export" />

        {/* ==================== Bonus & Credits Management Routes ==================== */}
        {/* Employee Routes */}
        <Route path="/credits" />
        <Route path="/credits/convert" />
        <Route path="/credits/gift" />
        <Route path="/credits/transactions" />
        <Route path="/credits/transactions/:id" />

        {/* Manager Routes */}
        <Route path="/manager/credits" />
        <Route path="/manager/credits/team" />
        <Route path="/manager/credits/gift" />
        <Route path="/manager/credits/deduct" />

        {/* Admin Routes */}
        <Route path="/admin/credits" />
        <Route path="/admin/credits/settings" />
        <Route path="/admin/credits/employees" />
        <Route path="/admin/credits/employees/:id" />
        <Route path="/admin/credits/adjust" />
        <Route path="/admin/credits/bulk-adjust" />
        <Route path="/admin/credits/transactions" />
        <Route path="/admin/credits/export" />

        {/* ==================== Reference Data Management Routes ==================== */}
        {/* Admin Routes (Master Data) */}
        <Route path="/admin/departments" />
        <Route path="/admin/departments/new" />
        <Route path="/admin/departments/:id/edit" />
        <Route path="/admin/departments/:id/delete" />
        <Route path="/admin/positions" />
        <Route path="/admin/positions/new" />
        <Route path="/admin/positions/:id/edit" />
        <Route path="/admin/positions/:id/delete" />

        {/* ==================== Admin & Session Management Routes ==================== */}
        {/* Admin Session Management */}
        <Route path="/admin/sessions" />
        <Route path="/admin/sessions/:id/revoke" />
        <Route path="/admin/users/:id/lock" />
        <Route path="/admin/users/:id/unlock" />
        <Route path="/admin/users/:id/reset-password" />

        {/* ==================== Dashboard & Home Routes ==================== */}
        {/* Role-based Home/Dashboard */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route path="/dashboard/employee" />
        <Route path="/dashboard/manager" />
        <Route path="/dashboard/admin" />

        {/* ==================== Error & Utility Routes ==================== */}
        {/* System Routes */}
        <Route path="/404" />
        <Route path="/403" />
        <Route path="/500" />
        <Route path="/unauthorized" />
        <Route path="/settings" />
        <Route path="/help" />
        <Route path="/notifications" />

        {/* Legacy routes - kept for backward compatibility */}
        <Route path="/employees" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
        <Route path="/add-employee" element={<ProtectedRoute><Layout><AddEmployee /></Layout></ProtectedRoute>} />

        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;