# Employee Transfer Bonus - API Contract

## Overview
This document describes the API contract for the Employee Transfer Bonus feature. The frontend uses React Query for data fetching and expects the following endpoints and response structures.

---

## API Endpoints

### 1. Get Team Members
**Endpoint:** `GET /api/credits/team`

**Purpose:** Fetch a paginated list of team members that the current employee can transfer credits to.

#### Request Parameters (Query Strings)
```
page: number (optional, default: 1, must be > 0)
size: number (optional, default: 10, must be > 0)
```

#### Request Example
```bash
GET /api/credits/team?page=1&size=10
```

#### Response Format
```typescript
{
  "teamMembers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@company.com",
      "position": "Software Engineer",
      "department": "Engineering",
      "avatar": "https://example.com/avatar.jpg" // optional
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "position": "Product Manager",
      "department": "Product",
      "avatar": null
    }
  ],
  "totalRecords": 45
}
```

#### Response Fields
- **teamMembers** (array): List of team members
  - **id** (number): Unique employee identifier
  - **name** (string): Full name of the employee
  - **email** (string): Email address
  - **position** (string | null): Job title/position (nullable)
  - **department** (string | null): Department name (nullable)
  - **avatar** (string | null, optional): URL to profile avatar image

- **totalRecords** (number): Total number of team members (for pagination calculation)

#### HTTP Status Codes
- **200**: Success (also returned with empty list if downstream employee-service is unreachable)
- **400**: Bad request (invalid pagination parameters)
- **401**: Unauthorized (user not authenticated)

---

### 2. Transfer Credits
**Endpoint:** `POST /api/credits/transfer`

**Purpose:** Transfer bonus credits from the current employee to another team member.

#### Request Body
```json
{
  "recipientId": 5,
  "points": 100,
  "note": "Great job on the presentation!"
}
```

#### Request Fields
- **recipientId** (number, required): ID of the employee receiving the credits
- **points** (number, required): Number of points to transfer
  - Must be greater than 0
  - Must be a whole number (integer)
  - Must not exceed the sender's current balance
- **note** (string, optional): Optional message/reason for the transfer (max 500 characters recommended)

#### Response Format - Success
```typescript
{
  "success": true,
  "message": "Credits transferred successfully",
  "newBalance": 900
}
```

#### Response Format - Error
```typescript
{
  "success": false,
  "message": "Detailed error message explaining why transfer failed"
}
```

#### Response Fields
- **success** (boolean): Whether the transfer succeeded
- **message** (string): Human-readable message (used for toast notifications)
- **newBalance** (number, optional): Sender's new balance after transfer (only on success)

#### HTTP Status Codes
- **200**: Transfer successful (check `success` field)
- **400**: Bad request (invalid input, e.g., negative points, invalid recipient)
- **401**: Unauthorized (user not authenticated)
- **403**: Forbidden (insufficient balance, cannot transfer to self, invalid recipient)
- **404**: Recipient not found
- **500**: Server error

---

## Business Logic Requirements

### 1. Team Members Filtering & Sorting
- Extract requester ID from JWT Bearer token (401 if missing/invalid)
- Fetch direct reports from employee-service: `/api/employees/manager/{requesterId}`
- Exclude the requester themselves
- Include only employees with `status == "ACTIVE"` (case-insensitive)
- Sort deterministically by `fullName` (A–Z, case-insensitive), then by `id`
- If employee-service is unreachable, return 200 with empty list

### 2. Pagination (1-based)
- Validate `page` and `size` are positive integers; otherwise 400
- Defaults: `page=1`, `size=10` if omitted
- Slice sorted list: `from = (page - 1) * size`, `to = from + size`
- `totalRecords` is the filtered count **before** pagination

### 3. Transfer Validation
The backend must validate:

1. **Sender Validation**
   - Sender must be authenticated
   - Sender must be an active employee

2. **Recipient Validation**
   - Recipient must exist
   - Recipient must be active
   - Recipient cannot be the sender (cannot transfer to self)
   - Recipient must be in the same organization (optional, depends on business rules)

3. **Points Validation**
   - Points must be a positive integer (> 0)
   - Points must not exceed sender's current balance
   - Points must be a whole number (no decimals)

4. **Transaction Validation**
   - Prevent double-processing (idempotency consideration)
   - Record transaction history for audit trail

### 3. Transfer Execution
1. Validate all conditions above
2. Deduct points from sender's balance
3. Add points to recipient's balance
4. Create transaction record with:
   - Type: "TRANSFER_SENT" (for sender)
   - Type: "TRANSFER_RECEIVED" (for recipient)
   - Amount of points
   - Note/message
   - Timestamp
   - Both parties' IDs
5. Return updated sender balance

### 4. Transaction History
Both parties should have transaction records:
- **Sender**: Sees transaction as "TRANSFER_SENT"
- **Recipient**: Sees transaction as "TRANSFER_RECEIVED"

---

## Error Scenarios & Messages

| Scenario | HTTP Status | Message | Action |
|----------|------------|---------|--------|
| Invalid page/size | 400 | "Invalid pagination parameters" | Show alert |
| User not authenticated | 401 | "Unauthorized" | Redirect to login |
| Downstream employee-service unreachable | 200 | (empty list) | Show empty state |

---

## Frontend Expectations

### Data Flow
1. **Page Load**: Fetch team members with `page=1, size=10`
2. **Pagination**: Re-fetch with new `page` or `size` parameters
3. **Transfer Click**: Open modal with selected member
4. **Submit Transfer**: POST to `/api/credits/transfer` with request body
5. **Success**: 
   - Show success toast with message
   - Refetch team members list (invalidate query)
   - Close modal
   - Update balance if available
6. **Error**: Show error toast with backend message
7. **Downstream failure**: If response is 200 with empty list (employee-service down), show empty state

### Loading States
- **Initial Load**: Show skeleton loaders
- **Page Change**: Show opacity overlay on table
- **Transfer**: Disable transfer button, show "Transferring..." text

### Validation
- Frontend validates input before submission
- Frontend respects max balance as upper limit in input

---

## Example Integration Flow

### Scenario: User transfers 50 points to John (ID: 5)

**Request:**
```bash
POST /api/credits/transfer
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "recipientId": 5,
  "points": 50,
  "note": "Great presentation!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Credits transferred successfully to John Doe",
  "newBalance": 950
}
```

**Frontend Actions:**
1. Show toast: "Credits transferred successfully to John Doe"
2. Close modal
3. Invalidate `teamMembers` query (forces refetch)
4. Update UI balance to 950 (if implemented)

---

## Additional Considerations

### Security
- Validate JWT token in Authorization header
- Ensure user can only transfer from their own account
- Log all transfers for audit trail

### Performance
- Implement pagination (default page size: 10)
- Consider caching team members list (expires after 5 minutes)
- Limit transfer note length (e.g., 500 characters)

### Auditing
- Store transfer history with:
  - Sender ID
  - Recipient ID
  - Amount
  - Note
  - Timestamp
  - IP address (optional)

### Future Enhancements
- Transfer approval workflow
- Transfer limits per day/month
- Recipient preferences (allow/disallow transfers)
- Email notifications for both parties
- Export transfer history
