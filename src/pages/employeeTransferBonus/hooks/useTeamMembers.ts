import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
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

export function useTeamMembers() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");

    // Fetch team members
    const { data, isLoading, isFetching, error } =
        useQuery<ViewTeamMembersResponse>({
            queryKey: ["teamMembers", page, pageSize, search],
            queryFn: () => fetchTeamMembers({ page, size: pageSize, search: search || undefined }),
        });

    const onSuccess = (message?: string) => {
        toast.success(message || "Action completed successfully");
        queryClient.invalidateQueries({
            queryKey: ["teamMembers"],
        });
        queryClient.invalidateQueries({
            queryKey: ["bonusBalance"],
        });
    };

    const onError = (error: unknown, fallback = "Action failed") => {
        const message = isAxiosError(error)
            ? (error.response?.data as { message?: string })?.message || fallback
            : error instanceof Error
                ? error.message
                : fallback;

        toast.error(message);
    };

    // Transfer credits mutation
    const transferMutation = useMutation({
        mutationFn: (body: TransferCreditsRequest) => transferCredits(body),
        onSuccess: (response) => {
            const details = `ID: #${response.transferId} | Points: ${response.numberPoint}${response.note ? ` | Note: ${response.note}` : ""} | Time: ${new Date(response.createdAt).toLocaleString()}`;
            onSuccess(details);
        },
        onError: (error) => onError(error, "Transfer failed"),
    });

    const giftMutation = useMutation({
        mutationFn: (body: AdjustCreditsRequest) => giftCredits(body),
        onSuccess: (response) => {
            const details = `ID: #${response.transferId} | Points: ${response.numberPoint}${response.note ? ` | Note: ${response.note}` : ""} | Time: ${new Date(response.createdAt).toLocaleString()}`;
            onSuccess(details);
        },
        onError: (error) => onError(error, "Gift failed"),
    });

    const deductMutation = useMutation({
        mutationFn: (body: AdjustCreditsRequest) => deductCredits(body),
        onSuccess: (response) => {
            const details = `ID: #${response.transferId} | Points: ${response.numberPoint}${response.note ? ` | Note: ${response.note}` : ""} | Time: ${new Date(response.createdAt).toLocaleString()}`;
            onSuccess(details);
        },
        onError: (error) => onError(error, "Deduction failed"),
    });

    const totalPages = Math.max(
        1,
        Math.ceil((data?.totalRecords ?? 0) / pageSize)
    );

    // Reset to first page when search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

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
        search,
        setSearch,
        transferCredits: transferMutation.mutate,
        isTransferring: transferMutation.isPending,
        giftCredits: giftMutation.mutate,
        isGifting: giftMutation.isPending,
        deductCredits: deductMutation.mutate,
        isDeducting: deductMutation.isPending,
        userRole: data?.role,
    };
}
