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

    // Calculate conversion rate: conversionRate is USD equivalent in cents, so divide by 100
    // e.g., if conversionRate = 1000, then 1 credit = 1000 cents = $10
    const creditToUsdRate = data ? data.conversionRate / 100 : 0;

    return {
        settings: data,
        creditToUsdRate,
        isLoading,
        isFetching,
        error,
    };
}
