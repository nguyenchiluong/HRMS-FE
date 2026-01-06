import { useQuery } from "@tanstack/react-query";
import { fetchBonusSettings } from "../api/settings";
import { BonusSettingsResponse } from "../types/redeem";

export function useBonusSettings() {
    const { data, isLoading, error, isFetching } = useQuery<BonusSettingsResponse>({
        queryKey: ["bonusSettings"],
        queryFn: fetchBonusSettings,
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
    });

    // Calculate conversion rate: conversionRate is VND equivalent
    // e.g., if conversionRate = 10000, then 1 credit = 10,000 VND
    const creditToVndRate = data ? data.conversionRate : 0;

    return {
        settings: data,
        creditToVndRate,
        isLoading,
        isFetching,
        error,
    };
}
