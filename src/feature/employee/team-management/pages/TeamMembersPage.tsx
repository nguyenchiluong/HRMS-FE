import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeamMembersTable } from '../components/TeamMembersTable';
import { SearchAndFilters } from '../components/SearchAndFilters';
import { TeamMemberDetailsModal } from '../components/TeamMemberDetailsModal';
import { TeamMetricsCards } from '../components/TeamMetricsCards';
import { useTeamMembers, useTeamMembersSummary } from '../hooks/useTeamMembers';
import { TeamMember, TeamMembersFilters } from '../types';

export default function TeamMembersPage() {
  const [filters, setFilters] = useState<TeamMembersFilters>({
    page: 1,
    pageSize: 10,
  });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch summary (overall team metrics - no filters, fetched once)
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useTeamMembersSummary();

  // Fetch paginated team members
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isFetching: isMembersFetching,
    error: membersError,
  } = useTeamMembers(filters);

  const isLoading = isSummaryLoading || isMembersLoading;
  const error = summaryError || membersError;

  // Extract data from API responses
  const teamMembers = membersData?.teamMembers || [];
  const totalRecords = membersData?.totalRecords || 0;
  const totalPages = membersData?.totalPages || 1;
  const currentPage = membersData?.currentPage || filters.page || 1;
  const summary = summaryData || {
    activeMembers: 0,
    clockedInCount: 0,
    totalPendingTimesheets: 0,
    totalPendingTimeOff: 0,
  };

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: filters.pageSize || 10,
    });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if ((filters.page || 1) !== 1) {
      setFilters({ ...filters, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    filters.department,
    filters.status,
    filters.position,
  ]);

  const handleFiltersChange = (newFilters: TeamMembersFilters) => {
    // Reset to page 1 when filters change
    setFilters({ ...newFilters, page: 1 });
  };

  if (error) {
    return (
      <div className="mt-8 px-6 md:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load team members. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const startIndex = totalRecords > 0 ? (currentPage - 1) * (filters.pageSize || 10) : 0;
  const endIndex = Math.min(startIndex + (filters.pageSize || 10), totalRecords);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  };

  const handlePreviousPage = () => {
    setFilters({ ...filters, page: Math.max((filters.page || 1) - 1, 1) });
  };

  const handleNextPage = () => {
    setFilters({ ...filters, page: Math.min((filters.page || 1) + 1, totalPages) });
  };

  const handlePageClick = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="mx-auto min-h-screen space-y-8 px-20 py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">My Team</h1>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {totalRecords} {totalRecords === 1 ? 'member' : 'members'}
          </span>
        </div>
      </header>

      {/* Stats Cards */}
      <TeamMetricsCards summary={summary} totalMembers={totalRecords} />

      {/* Filter Bar */}
      <SearchAndFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
      />

      {/* Data Table */}
      <TeamMembersTable
        teamMembers={teamMembers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Footer / Pagination */}
      {!isLoading && totalRecords > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t bg-white px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{' '}
            {totalRecords} results
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-400">
                  {page}
                </span>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Team Member Details Modal */}
      <TeamMemberDetailsModal
        member={selectedMember}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </div>
  );
}
