import springApi from "@/api/spring";
import { BonusSettingsResponse } from "../types/redeem";

export async function fetchBonusSettings(): Promise<BonusSettingsResponse> {
    const { data } = await springApi.get<BonusSettingsResponse>(
        "/api/credits/settings"
    );
    return data;
}
