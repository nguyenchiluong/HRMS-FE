import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
    ViewTeamMembersRequest,
    ViewTeamMembersResponse,
    TransferCreditsRequest,
} from "../types/teamMember";
import { fetchTeamMembers, transferCredits } from "../api/teamMembers";
import { useToast } from "@/hooks/use-toast";

export function useTeamMembers() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Fetch team members
    const { data, isLoading, isFetching, error } =
        useQuery<ViewTeamMembersResponse>({
            queryKey: ["teamMembers", page, pageSize],
            queryFn: () => fetchTeamMembers({ page, size: pageSize }),
        });

    // Transfer credits mutation
    const transferMutation = useMutation({
        mutationFn: (body: TransferCreditsRequest) => transferCredits(body),
        onSuccess: (response) => {
            toast({
                title: "Success",
                description:
                    response.message || "Credits transferred successfully",
                variant: "default",
            });
            // Invalidate and refetch team members data
            queryClient.invalidateQueries({
                queryKey: ["teamMembers"],
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Transfer failed",
                variant: "destructive",
            });
        },
    });

    const totalPages = Math.max(
        1,
        Math.ceil((data?.totalRecords ?? 0) / pageSize)
    );

    return {
        teamMembers: data?.teamMembers ?? [],
        totalRecords: data?.totalRecords ?? 0,
        totalPages,
        page,
        pageSize,
        isLoading,
        isFetching,
        error,
        setPage,
        setPageSize,
        transferCredits: transferMutation.mutate,
        isTransferring: transferMutation.isPending,
    };
}
