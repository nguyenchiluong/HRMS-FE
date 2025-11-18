# Web UI Routes - HR Management System

## Route Structure Convention
- **Public Routes**: No authentication required
- **Protected Routes**: Require authentication
- **Role-based Routes**: Require specific roles (Admin/Manager/Employee)

---

## 1. Authentication & Onboarding Routes

### Public Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/login` | Login Page | User authentication screen | Public |
| `/forgot-password` | Forgot Password | Request password reset email | Public |
| `/reset-password/:token` | Reset Password | Reset password using token from email | Public |
| `/onboarding/:token` | Employee Onboarding Form | New hire completes profile via secure link | Public |

### Protected Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/logout` | Logout Handler | Logout and redirect to login | Any |
| `/profile/me` | My Profile View | Employee views own complete profile | Any |
| `/profile/me/edit` | Edit My Profile | Employee edits allowed profile sections | Employee |
| `/change-password` | Change Password | User changes own password | Any |

---

## 2. Employee Profile Management Routes

### Admin Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/admin/employees` | Employees List | View all employees with filters and pagination | Admin/Manager |
| `/admin/employees/new` | New Hire Form (Single) | Create single employee initial profile | Admin |
| `/admin/employees/bulk` | Bulk Onboard New Hires | Upload CSV/Excel for bulk employee creation | Admin |
| `/admin/employees/:id` | Employee Details View | View complete employee profile (all tabs) | Admin/Manager |
| `/admin/employees/:id/edit` | Edit Employee Profile | Admin edits employee details (Job Details tab) | Admin |
| `/admin/employees/:id/deactivate` | Deactivate Employee Confirmation | Confirm employee deactivation | Admin |
| `/admin/employees/:id/reactivate` | Reactivate Employee Confirmation | Confirm employee reactivation | Admin |
| `/admin/employees/pending` | Pending Profiles List | View employees with PENDING status | Admin |
| `/admin/employees/inactive` | Inactive Profiles List | View deactivated employees | Admin |

### Profile Update Requests (Admin)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/admin/profile-requests` | Profile Update Requests Queue | View all pending profile update requests | Admin |
| `/admin/profile-requests/:id` | Profile Request Review | Review and approve/reject profile update request | Admin |

---

## 3. Employee Requests Management Routes

### Employee Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/requests` | My Requests List | View own request history with filters | Employee |
| `/requests/new` | Create New Request | Submit new request (Leave/WFH/Timesheet/Business Trip) | Employee |
| `/requests/:id` | Request Details | View detailed information about specific request | Employee |
| `/requests/:id/edit` | Edit Request | Modify pending request | Employee |
| `/requests/:id/cancel` | Cancel Request Confirmation | Cancel pending/approved request | Employee |

### Attendance Routes (Employee)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/attendance` | Attendance Dashboard | Check-in/Check-out widget + attendance history | Employee |
| `/attendance/history` | Attendance History | View detailed attendance records | Employee |
| `/attendance/timesheet` | Timesheet Log | Log and view timesheet records | Employee |
| `/attendance/timesheet/correct` | Request Timesheet Correction | Submit timesheet correction request | Employee |

### Manager Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/manager/requests` | Team Requests Queue | View and manage team requests | Manager/Admin |
| `/manager/requests/:id` | Request Review | Review and approve/reject request | Manager/Admin |
| `/manager/requests/pending` | Pending Requests | Filter view for pending requests | Manager/Admin |
| `/manager/requests/history` | Request History | View approved/rejected request history | Manager/Admin |
| `/manager/dashboard/requests` | Requests Summary Dashboard | View statistics and aggregated request data | Manager/Admin |

---

## 4. Employee Activities & Campaigns Management Routes

### Manager/Admin Routes (Campaign Management)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/campaigns` | Campaigns Hub | View all campaigns (active, draft, completed) | Any |
| `/campaigns/new` | Create Campaign | Create new operational campaign | Admin |
| `/campaigns/:id` | Campaign Details | View campaign details, rules, and registrations | Any |
| `/campaigns/:id/edit` | Edit Campaign | Update campaign information | Admin |
| `/campaigns/:id/publish` | Publish Campaign Confirmation | Publish draft campaign to make it active | Admin |
| `/campaigns/:id/close` | Close Campaign Confirmation | Close active campaign | Admin |
| `/campaigns/:id/delete` | Delete Campaign Confirmation | Delete campaign (only if no registrations) | Admin |
| `/campaigns/:id/registrations` | Campaign Registrations List | View employees registered for campaign | Manager/Admin |

### Activity Approval Routes (Manager)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/activities` | Activities Queue | View activity submissions (own/team/all based on role) | Any |
| `/activities/pending` | Pending Activities | View pending activity submissions for approval | Manager/Admin |
| `/activities/:id` | Activity Details | View detailed activity submission with evidence | Any |
| `/activities/:id/approve` | Approve Activity | Approve activity and award points | Manager/Admin |
| `/activities/:id/reject` | Reject Activity | Reject activity with reason | Manager/Admin |
| `/activities/history` | Approval History | View approved/rejected activity history | Manager/Admin |

### Employee Routes (Campaign Participation)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/campaigns/active` | Active Campaigns | View active campaigns available for registration | Employee |
| `/campaigns/my-campaigns` | My Campaigns | View campaigns I'm registered in | Employee |
| `/campaigns/:id/register` | Register for Campaign | Join campaign | Employee |
| `/campaigns/:id/unregister` | Unregister Confirmation | Leave campaign | Employee |
| `/my-activities` | My Activities | View own activity submissions | Employee |
| `/my-activities/new` | Submit Activity | Submit activity result with evidence upload | Employee |
| `/my-activities/:id` | My Activity Details | View own activity submission details | Employee |
| `/my-activities/:id/edit` | Edit Activity | Update pending activity submission | Employee |
| `/my-activities/:id/delete` | Delete Activity Confirmation | Delete pending activity | Employee |

### Leaderboard Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/leaderboard/:campaignId` | Campaign Leaderboard | View real-time rankings for campaign | Any |
| `/leaderboard/:campaignId/export` | Export Leaderboard | Download leaderboard as CSV | Admin |

---

## 5. Bonus & Credits Management Routes

### Employee Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/credits` | My Credits Dashboard | View credit balance and transaction history | Employee |
| `/credits/convert` | Convert Points to Credits | Convert activity points to bonus credits | Employee |
| `/credits/gift` | Gift Credits | Transfer credits to another employee | Employee |
| `/credits/transactions` | Transaction History | View detailed credit transaction history | Employee |
| `/credits/transactions/:id` | Transaction Details | View specific transaction details | Employee |

### Manager Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/manager/credits` | Manager Credits Dashboard | View own credits + team members' credits | Manager |
| `/manager/credits/team` | Team Credits Overview | View team members' credit balances | Manager |
| `/manager/credits/gift` | Gift Credits to Team | Gift credits to team members | Manager |
| `/manager/credits/deduct` | Deduct Credits | Deduct credits from team member (with reason) | Manager |

### Admin Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/admin/credits` | Credits Management Dashboard | View all employee credit balances | Admin |
| `/admin/credits/settings` | Bonus System Settings | Configure conversion rates and rules | Admin |
| `/admin/credits/employees` | All Employee Credits | List all employees with credit balances | Admin |
| `/admin/credits/employees/:id` | Employee Credit Details | View specific employee's credit details | Admin |
| `/admin/credits/adjust` | Adjust Credits | Add or deduct credits from employee account | Admin |
| `/admin/credits/bulk-adjust` | Bulk Credit Adjustment | Adjust credits for multiple employees | Admin |
| `/admin/credits/transactions` | All Transactions | View all credit transactions system-wide | Admin |
| `/admin/credits/export` | Export Credit Data | Download credit data as CSV | Admin |

---

## 6. Reference Data Management Routes

### Admin Routes (Master Data)
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/admin/departments` | Departments Management | CRUD operations for departments | Admin |
| `/admin/departments/new` | Create Department | Add new department | Admin |
| `/admin/departments/:id/edit` | Edit Department | Update department information | Admin |
| `/admin/departments/:id/delete` | Delete Department | Remove department (if no employees) | Admin |
| `/admin/positions` | Positions Management | CRUD operations for job positions | Admin |
| `/admin/positions/new` | Create Position | Add new job position | Admin |
| `/admin/positions/:id/edit` | Edit Position | Update position information | Admin |
| `/admin/positions/:id/delete` | Delete Position | Remove position (if no employees) | Admin |

---

## 7. Admin & Session Management Routes

### Admin Session Management
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/admin/sessions` | Active Sessions | View all active user sessions | Admin |
| `/admin/sessions/:id/revoke` | Revoke Session | Force logout specific user session | Admin |
| `/admin/users/:id/lock` | Lock User Account | Disable user account | Admin |
| `/admin/users/:id/unlock` | Unlock User Account | Re-enable user account | Admin |
| `/admin/users/:id/reset-password` | Admin Reset Password | Reset user password (admin action) | Admin |

---

## 8. Dashboard & Home Routes

### Role-based Home/Dashboard
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/` or `/dashboard` | Dashboard (Role-based) | Main dashboard after login (redirects based on role) | Any |
| `/dashboard/employee` | Employee Dashboard | Employee home: requests, attendance, campaigns, credits | Employee |
| `/dashboard/manager` | Manager Dashboard | Manager home: team requests, activities, team credits | Manager |
| `/dashboard/admin` | Admin Dashboard | Admin home: system overview, pending actions, statistics | Admin |

---

## 9. Error & Utility Routes

### System Routes
| Route | Screen Name | Description | User Role |
|-------|-------------|-------------|-----------|
| `/404` | Page Not Found | 404 error page | Any |
| `/403` | Forbidden | Access denied page | Any |
| `/500` | Server Error | Internal server error page | Any |
| `/unauthorized` | Unauthorized | Not authenticated page (redirect to login) | Any |
| `/settings` | User Settings | Personal preferences and settings | Any |
| `/help` | Help & Documentation | User guide and FAQs | Any |
| `/notifications` | Notifications Center | View all notifications | Any |

---

## Route Parameter Conventions

### Path Parameters
- `:id` - Entity ID (employee, request, campaign, activity, etc.)
- `:token` - Secure token for onboarding/password reset
- `:campaignId` - Campaign identifier

### Query Parameters (Common across routes)
- `?page=1` - Pagination page number
- `?limit=20` - Items per page
- `?sort=created_at:desc` - Sorting field and direction
- `?status=pending` - Filter by status
- `?search=keyword` - Search query
- `?start_date=2025-01-01` - Date range start
- `?end_date=2025-12-31` - Date range end
- `?department_id=123` - Filter by department
- `?employee_id=456` - Filter by employee

---

## Navigation Structure

### Main Navigation (Based on Role)

#### Employee Navigation
```
- Dashboard
- My Profile
- Requests
  - New Request
  - My Requests
  - Attendance
- Campaigns
  - Active Campaigns
  - My Campaigns
  - My Activities
  - Leaderboards
- Credits
  - My Credits
  - Convert Points
  - Gift Credits
  - Transactions
```

#### Manager Navigation
```
- Dashboard
- My Profile
- Team Requests
  - Pending Requests
  - Request History
  - Requests Summary
- Team Activities
  - Pending Activities
  - Approval History
- Campaigns (same as Employee)
- Team Credits
  - My Credits
  - Team Overview
  - Gift Credits
  - Deduct Credits
- Employees (View Only)
```

#### Admin Navigation
```
- Dashboard
- Employees
  - All Employees
  - Pending Profiles
  - Inactive Employees
  - New Hire (Single/Bulk)
  - Profile Requests
- Requests Management
  - All Requests
  - Pending Requests
  - Requests Summary
- Campaigns
  - All Campaigns
  - Create Campaign
  - Activities Queue
- Credits Management
  - All Credits
  - System Settings
  - Adjust Credits
  - Transactions
  - Export Data
- Reference Data
  - Departments
  - Positions
- System Admin
  - Active Sessions
  - User Accounts
- My Profile
```

---

## Route Guards & Redirects

### Authentication Guards
- Unauthenticated users accessing protected routes → Redirect to `/login`
- Authenticated users accessing `/login` → Redirect to role-based dashboard

### Authorization Guards
- Employee accessing admin routes → Redirect to `/403`
- Manager accessing admin-only routes → Redirect to `/403`
- User accessing other user's private data → Redirect to `/403`

### Status-based Guards
- Locked account attempting login → Show error message on `/login`
- PENDING status employee → Redirect to onboarding completion
- INACTIVE status employee → Prevent login

---

## Total Route Count Summary

| Category | Route Count |
|----------|-------------|
| Authentication & Onboarding | 8 |
| Employee Profile Management | 11 |
| Employee Requests Management | 15 |
| Campaigns & Activities | 23 |
| Bonus & Credits | 18 |
| Reference Data | 7 |
| Admin & Session Management | 5 |
| Dashboards | 4 |
| Error & Utility | 7 |
| **Total** | **98 routes** |

---

## Implementation Notes

1. **Dynamic Route Parameters**: Use path parameters (`:id`, `:token`) for resource-specific routes
2. **Query Parameters**: Implement consistent query parameter handling for filtering, pagination, and sorting
3. **Breadcrumbs**: Implement breadcrumb navigation for nested routes
4. **Route Guards**: Implement middleware for authentication and authorization checks
5. **Lazy Loading**: Consider code-splitting for admin routes to reduce initial bundle size
6. **Deep Linking**: Ensure all routes support direct URL access with proper state restoration
7. **Mobile Responsiveness**: All routes should render responsive layouts
8. **SEO**: Use appropriate meta tags and page titles for each route
9. **Analytics**: Track route navigation for user behavior analysis
10. **Error Boundaries**: Implement error boundaries at route level for graceful error handling
