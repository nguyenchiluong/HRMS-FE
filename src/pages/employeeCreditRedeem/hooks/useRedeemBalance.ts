import { useQuery } from "@tanstack/react-query";
import { fetchRedeemBalance } from "../api/redeem";
import { RedeemBalanceResponse } from "../types/redeem";

export function useRedeemBalance() {
    const { data, isLoading, error, refetch, isFetching } = useQuery<RedeemBalanceResponse>({
        queryKey: ["redeemBalance"],
        queryFn: fetchRedeemBalance,
        staleTime: 30000,
        refetchOnWindowFocus: true,
    });

    return {
        balance: data?.bonusPoint ?? 0,
        isLoading,
        isFetching,
        error,
        refetch,
    };
}
