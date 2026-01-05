import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
    ViewTeamMembersRequest,
    ViewTeamMembersResponse,
    TransferCreditsRequest,
    AdjustCreditsRequest,
} from "../types/teamMember";
import {
    fetchTeamMembers,
    transferCredits,
    giftCredits,
    deductCredits,
} from "../api/teamMembers";
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

    const onSuccess = (message?: string) => {
        toast({
            title: "Success",
            description: message || "Action completed successfully",
            variant: "default",
        });
        queryClient.invalidateQueries({
            queryKey: ["teamMembers"],
        });
        queryClient.invalidateQueries({
            queryKey: ["bonusBalance"],
        });
    };

    const onError = (error: unknown, fallback = "Action failed") => {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : fallback,
            variant: "destructive",
        });
    };

    // Transfer credits mutation
    const transferMutation = useMutation({
        mutationFn: (body: TransferCreditsRequest) => transferCredits(body),
        onSuccess: (response) => onSuccess(response.message || "Credits transferred successfully"),
        onError: (error) => onError(error, "Transfer failed"),
    });

    const giftMutation = useMutation({
        mutationFn: (body: AdjustCreditsRequest) => giftCredits(body),
        onSuccess: (response) => onSuccess(response.message || "Credits gifted successfully"),
        onError: (error) => onError(error, "Gift failed"),
    });

    const deductMutation = useMutation({
        mutationFn: (body: AdjustCreditsRequest) => deductCredits(body),
        onSuccess: (response) => onSuccess(response.message || "Credits deducted successfully"),
        onError: (error) => onError(error, "Deduction failed"),
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
        giftCredits: giftMutation.mutate,
        isGifting: giftMutation.isPending,
        deductCredits: deductMutation.mutate,
        isDeducting: deductMutation.isPending,
    };
}
