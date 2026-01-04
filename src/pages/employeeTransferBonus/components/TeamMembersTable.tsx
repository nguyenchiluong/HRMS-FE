import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember } from "../types/teamMember";

interface TeamMembersTableProps {
    teamMembers: TeamMember[];
    isLoading: boolean;
    isFetching: boolean;
    renderAction: (member: TeamMember) => React.ReactNode;
}

export function TeamMembersTable({
    teamMembers,
    isLoading,
    isFetching,
    renderAction,
}: TeamMembersTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (teamMembers.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        No team members found
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={isFetching ? "opacity-60" : ""}>
            <CardHeader>
                <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>
                                                {member.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{member.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {member.email}
                                </TableCell>
                                <TableCell className="text-sm">{member.position}</TableCell>
                                <TableCell className="text-sm">{member.department}</TableCell>
                                <TableCell className="text-right">
                                    {renderAction(member)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
