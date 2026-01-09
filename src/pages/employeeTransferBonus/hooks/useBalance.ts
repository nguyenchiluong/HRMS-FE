import { useQuery } from "@tanstack/react-query";
import { fetchBalance } from "../api/teamMembers";
import { BonusPointBalanceResponse } from "../types/teamMember";

export function useBalance() {
    const { data, isLoading, isFetching, error, refetch } = useQuery<BonusPointBalanceResponse>({
        queryKey: ["bonusBalance"],
        queryFn: fetchBalance,
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        gcTime: 30000,
    });

    return {
        balance: data?.bonusPoint ?? 0,
        isLoading,
        isFetching,
        error,
        refetch: () => refetch({ cancelRefetch: true }),
    };
}
