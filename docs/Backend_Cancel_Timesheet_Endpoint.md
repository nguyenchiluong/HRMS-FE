# Backend Implementation Guide: Cancel Timesheet Endpoint

## Overview
This endpoint allows employees to cancel their pending timesheet submissions before a manager takes any action (approve/reject). After cancellation, the timesheet should be editable again so the employee can make changes and resubmit.

## Endpoint Specification

### HTTP Method & URL
```
PUT /api/v1/timesheet/{requestId}/cancel
```

### Request
- **Path Parameter**: `requestId` (integer) - The ID of the timesheet request to cancel
- **Headers**: 
  - `Authorization: Bearer <token>` (required)
  - `Content-Type: application/json`

### Response Format

#### Success Response (200 OK)
```json
{
  "message": "Timesheet cancelled successfully",
  "data": {
    "requestId": 2,
    "employeeId": 1,
    "employeeName": "Nguyen Tuan Kiet",
    "department": "Engineering",
    "year": 2026,
    "month": 1,
    "weekNumber": 1,
    "weekStartDate": "2025-12-28T17:00:00Z",
    "weekEndDate": "2026-01-03T17:00:00Z",
    "status": "DRAFT",  // or "CANCELLED" if you have that status
    "reason": "Original submission reason",
    "submittedAt": "2026-01-01T09:01:15.331149Z",
    "summary": {
      "totalHours": 32,
      "regularHours": 32,
      "overtimeHours": 0,
      "leaveHours": 0
    },
    "entries": [
      {
        "id": 1,
        "taskId": 1,
        "taskCode": "PROJ-001",
        "taskName": "Project Alpha",
        "entryType": "project",
        "hours": 32
      }
    ],
    "createdAt": "2026-01-01T09:01:15.331409Z",
    "updatedAt": "2026-01-01T09:15:30.123456Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid request
```json
{
  "message": "Cannot cancel timesheet. Only pending timesheets can be cancelled."
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden** - User doesn't own the timesheet
```json
{
  "message": "You can only cancel your own timesheets."
}
```

**404 Not Found** - Timesheet doesn't exist
```json
{
  "message": "Timesheet not found."
}
```

**409 Conflict** - Timesheet already processed
```json
{
  "message": "Cannot cancel timesheet. It has already been approved or rejected."
}
```

## Business Rules & Validation

### 1. Status Validation
- **Only `PENDING` timesheets can be cancelled**
- If status is `APPROVED`: Return 409 Conflict with message "Cannot cancel timesheet. It has already been approved."
- If status is `REJECTED`: Return 409 Conflict with message "Cannot cancel timesheet. It has already been rejected."
- If status is `DRAFT`: Return 400 Bad Request with message "Timesheet is already in draft status."

### 2. Ownership Validation
- **Only the employee who submitted the timesheet can cancel it**
- Verify that `timesheet.employeeId` matches the authenticated user's employee ID
- If not, return 403 Forbidden

### 3. Manager Action Check
- **Cannot cancel if manager has already taken action**
- Check if `approvedAt` or `rejectionReason` is set
- If either exists, return 409 Conflict

### 4. Existence Check
- Verify the timesheet with `requestId` exists
- If not found, return 404 Not Found

## Status Transition

### Recommended Approach
After successful cancellation, update the timesheet status to **`DRAFT`** so the employee can edit and resubmit.

**Status Flow:**
```
DRAFT → (submit) → PENDING → (cancel) → DRAFT
PENDING → (approve) → APPROVED (cannot cancel)
PENDING → (reject) → REJECTED (cannot cancel)
```

**Alternative Approach (if you have CANCELLED status):**
If your system has a `CANCELLED` status, you can use that instead. However, ensure that:
- Timesheets with `CANCELLED` status are still editable by the employee
- The frontend allows editing for `CANCELLED` status (currently it allows `DRAFT` and `REJECTED`)

## Implementation Steps

### 1. Controller Method
```csharp
[HttpPut("{requestId}/cancel")]
[Authorize]
public async Task<IActionResult> CancelTimesheet(int requestId)
{
    // Implementation here
}
```

### 2. Service Method Logic
```csharp
public async Task<TimesheetResponse> CancelTimesheet(int requestId, int employeeId)
{
    // 1. Fetch timesheet from database
    var timesheet = await _timesheetRepository.GetByIdAsync(requestId);
    
    // 2. Validate existence
    if (timesheet == null)
        throw new NotFoundException("Timesheet not found.");
    
    // 3. Validate ownership
    if (timesheet.EmployeeId != employeeId)
        throw new ForbiddenException("You can only cancel your own timesheets.");
    
    // 4. Validate status
    if (timesheet.Status != TimesheetStatus.PENDING)
    {
        if (timesheet.Status == TimesheetStatus.APPROVED)
            throw new ConflictException("Cannot cancel timesheet. It has already been approved.");
        if (timesheet.Status == TimesheetStatus.REJECTED)
            throw new ConflictException("Cannot cancel timesheet. It has already been rejected.");
        if (timesheet.Status == TimesheetStatus.DRAFT)
            throw new BadRequestException("Timesheet is already in draft status.");
    }
    
    // 5. Check if manager has taken action
    if (timesheet.ApprovedAt.HasValue || !string.IsNullOrEmpty(timesheet.RejectionReason))
        throw new ConflictException("Cannot cancel timesheet. Manager has already taken action.");
    
    // 6. Update status to DRAFT
    timesheet.Status = TimesheetStatus.DRAFT;
    timesheet.UpdatedAt = DateTime.UtcNow;
    
    // 7. Save changes
    await _timesheetRepository.UpdateAsync(timesheet);
    
    // 8. Map to response DTO
    return _mapper.Map<TimesheetResponse>(timesheet);
}
```

### 3. Database Considerations

**If using Entity Framework:**
- Ensure the `Status` field is updated
- Update `UpdatedAt` timestamp
- Consider adding an audit log entry for the cancellation action

**If using raw SQL:**
```sql
UPDATE timesheet_request 
SET status = 'DRAFT', 
    updated_at = NOW()
WHERE request_id = @requestId 
  AND employee_id = @employeeId 
  AND status = 'PENDING'
  AND approved_at IS NULL 
  AND rejection_reason IS NULL;
```

### 4. Include Entries in Response
**Important:** The response must include the `entries` array so the frontend can display the tasks. Make sure your response mapping includes:
- All timesheet entries with full details (taskId, taskCode, taskName, entryType, hours)

## Security Considerations

1. **Authentication**: Require valid JWT token
2. **Authorization**: Verify user owns the timesheet
3. **Rate Limiting**: Consider rate limiting to prevent abuse
4. **Audit Logging**: Log cancellation actions for compliance

## Testing Checklist

- [ ] Cancel a pending timesheet successfully
- [ ] Verify status changes to DRAFT
- [ ] Verify response includes entries array
- [ ] Test cancelling non-existent timesheet (404)
- [ ] Test cancelling another employee's timesheet (403)
- [ ] Test cancelling approved timesheet (409)
- [ ] Test cancelling rejected timesheet (409)
- [ ] Test cancelling draft timesheet (400)
- [ ] Test unauthenticated request (401)
- [ ] Verify timesheet is editable after cancellation
- [ ] Verify timesheet can be resubmitted after cancellation

## Frontend Integration Notes

The frontend expects:
1. **Status after cancellation**: `DRAFT` (or `CANCELLED` if you update frontend to support it)
2. **Response format**: Must match `TimesheetResponse` interface
3. **Entries included**: Response must include `entries` array
4. **Cache invalidation**: Frontend will automatically refresh data after success

## Example Request/Response

### Request
```http
PUT /api/v1/timesheet/2/cancel HTTP/1.1
Host: localhost:5188
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Success Response
```json
{
  "message": "Timesheet cancelled successfully",
  "data": {
    "requestId": 2,
    "employeeId": 1,
    "employeeName": "Nguyen Tuan Kiet",
    "department": "Engineering",
    "year": 2026,
    "month": 1,
    "weekNumber": 1,
    "weekStartDate": "2025-12-28T17:00:00Z",
    "weekEndDate": "2026-01-03T17:00:00Z",
    "status": "DRAFT",
    "reason": "Weekly timesheet for Week 1",
    "submittedAt": "2026-01-01T09:01:15.331149Z",
    "summary": {
      "totalHours": 32,
      "regularHours": 32,
      "overtimeHours": 0,
      "leaveHours": 0
    },
    "entries": [
      {
        "id": 1,
        "taskId": 1,
        "taskCode": "PROJ-001",
        "taskName": "Project Alpha",
        "entryType": "project",
        "hours": 32
      }
    ],
    "createdAt": "2026-01-01T09:01:15.331409Z",
    "updatedAt": "2026-01-01T09:15:30.123456Z"
  }
}
```

## Questions for Backend Team

1. Do you have a `CANCELLED` status, or should we use `DRAFT`?
2. Should cancelled timesheets be soft-deleted or just status-changed?
3. Do you want to track cancellation reason/comment?
4. Should there be a time limit (e.g., can only cancel within 24 hours)?
5. Do you need notification to manager when timesheet is cancelled?

