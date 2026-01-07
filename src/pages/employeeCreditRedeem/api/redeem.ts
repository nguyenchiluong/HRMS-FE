import springApi from "@/api/spring";
import {
    RedeemRequest,
    RedeemResponse,
    RedeemHistoryRequest,
    RedeemHistoryResponse,
    RedeemBalanceResponse,
} from "../types/redeem";

export async function createRedeem(
    body: RedeemRequest
): Promise<RedeemResponse> {
    const { data } = await springApi.post<RedeemResponse>(
        "/api/credits/redeem",
        body
    );
    return data;
}

export async function fetchRedeemHistory(
    params: RedeemHistoryRequest
): Promise<RedeemHistoryResponse> {
    const { data } = await springApi.get<RedeemHistoryResponse>(
        "/api/credits/redeem/history",
        { params }
    );
    return data;
}

export async function fetchRedeemBalance(): Promise<RedeemBalanceResponse> {
    const { data } = await springApi.get<RedeemBalanceResponse>(
        "/api/credits/balance"
    );
    return data;
}
