import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '../types';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  isLoading: boolean;
  onViewDetails?: (member: TeamMember) => void;
}

export function TeamMembersTable({
  teamMembers,
  isLoading,
  onViewDetails,
}: TeamMembersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="text-lg font-medium">No team members found</p>
        <p className="text-sm mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const getStatusVariant = (
    status: TeamMember['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time Status</TableHead>
            <TableHead>Employment Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.fullName}</span>
                    {member.jobLevel && (
                      <span className="text-xs text-muted-foreground">
                        {member.jobLevel}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{member.workEmail}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{member.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {member.position || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {member.department || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(member.status)}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  {/* Attendance Status */}
                  {member.attendanceStatus && (
                    <div className="flex items-center gap-1.5">
                      {member.attendanceStatus === 'clocked-in' ? (
                        <>
                          <Clock className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            Clocked In
                          </span>
                          {member.currentWorkingMinutes !== null &&
                            member.currentWorkingMinutes !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                ({Math.floor(member.currentWorkingMinutes / 60)}h{' '}
                                {member.currentWorkingMinutes % 60}m)
                              </span>
                            )}
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Clocked Out
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  {/* Pending Requests */}
                  {(member.pendingTimesheetCount || member.pendingTimeOffCount) && (
                    <div className="flex items-center gap-2">
                      {member.pendingTimesheetCount && member.pendingTimesheetCount > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          <span className="text-xs text-amber-600">
                            {member.pendingTimesheetCount} timesheet
                            {member.pendingTimesheetCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      {member.pendingTimeOffCount && member.pendingTimeOffCount > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-600">
                            {member.pendingTimeOffCount} request
                            {member.pendingTimeOffCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Last Timesheet Status */}
                  {member.lastTimesheetStatus && (
                    <div className="flex items-center gap-1">
                      {member.lastTimesheetStatus === 'APPROVED' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : member.lastTimesheetStatus === 'PENDING' ? (
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      ) : member.lastTimesheetStatus === 'REJECTED' ? (
                        <AlertCircle className="h-3 w-3 text-red-600" />
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        Timesheet: {member.lastTimesheetStatus}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    {member.employmentType || 'N/A'}
                  </span>
                  {member.timeType && (
                    <span className="text-xs text-muted-foreground">
                      {member.timeType}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails?.(member)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View employee details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
