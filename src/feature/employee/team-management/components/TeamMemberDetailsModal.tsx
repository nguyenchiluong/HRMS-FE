import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TeamMember } from '../types';
import {
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

interface TeamMemberDetailsModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamMemberDetailsModal({
  member,
  open,
  onOpenChange,
}: TeamMemberDetailsModalProps) {
  if (!member) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about {member.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.avatar || undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(member.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold">{member.fullName}</h3>
                <Badge variant={getStatusVariant(member.status)}>
                  {member.status}
                </Badge>
              </div>
              {member.jobLevel && (
                <p className="text-muted-foreground">{member.jobLevel}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{member.workEmail}</p>
                </div>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{member.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Job Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Job Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.position && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{member.position}</p>
                  </div>
                </div>
              )}
              {member.department && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{member.department}</p>
                  </div>
                </div>
              )}
              {member.employmentType && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="font-medium">{member.employmentType}</p>
                  </div>
                </div>
              )}
              {member.timeType && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Work Location</p>
                    <p className="font-medium">{member.timeType}</p>
                  </div>
                </div>
              )}
              {member.startDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(member.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time Management Information */}
          {(member.attendanceStatus ||
            member.pendingTimesheetCount ||
            member.pendingTimeOffCount ||
            member.lastTimesheetStatus) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Time Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {member.attendanceStatus && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Current Status
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              member.attendanceStatus === 'clocked-in'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {member.attendanceStatus === 'clocked-in'
                              ? 'Clocked In'
                              : 'Clocked Out'}
                          </Badge>
                          {member.attendanceStatus === 'clocked-in' &&
                            member.currentWorkingMinutes !== null &&
                            member.currentWorkingMinutes !== undefined && (
                              <span className="text-sm text-muted-foreground">
                                ({Math.floor(member.currentWorkingMinutes / 60)}h{' '}
                                {member.currentWorkingMinutes % 60}m)
                              </span>
                            )}
                        </div>
                        {member.clockInTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Since:{' '}
                            {format(new Date(member.clockInTime), 'h:mm a')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {member.lastTimesheetStatus && (
                    <div className="flex items-center gap-3">
                      {member.lastTimesheetStatus === 'APPROVED' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : member.lastTimesheetStatus === 'PENDING' ? (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      ) : member.lastTimesheetStatus === 'REJECTED' ? (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Timesheet Status
                        </p>
                        <Badge
                          variant={
                            member.lastTimesheetStatus === 'APPROVED'
                              ? 'default'
                              : member.lastTimesheetStatus === 'PENDING'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {member.lastTimesheetStatus}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {member.pendingTimesheetCount !== undefined &&
                    member.pendingTimesheetCount > 0 && (
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pending Timesheets
                          </p>
                          <p className="font-medium text-amber-600">
                            {member.pendingTimesheetCount} awaiting approval
                          </p>
                        </div>
                      </div>
                    )}
                  {member.pendingTimeOffCount !== undefined &&
                    member.pendingTimeOffCount > 0 && (
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pending Time Off Requests
                          </p>
                          <p className="font-medium text-blue-600">
                            {member.pendingTimeOffCount} awaiting approval
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
