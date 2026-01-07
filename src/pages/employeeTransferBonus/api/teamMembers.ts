import springApi from "@/api/spring";
import {
    ViewTeamMembersRequest,
    ViewTeamMembersResponse,
    TransferCreditsRequest,
    TransferCreditsResponse,
    BonusPointBalanceResponse,
    AdjustCreditsRequest,
    AdjustCreditsResponse,
} from "../types/teamMember";

export async function fetchTeamMembers(
    params: ViewTeamMembersRequest
): Promise<ViewTeamMembersResponse> {
    const { data } = await springApi.get<ViewTeamMembersResponse>(
        "/api/credits/team",
        { params }
    );
    return data;
}

export async function transferCredits(
    body: TransferCreditsRequest
): Promise<TransferCreditsResponse> {
    const { data } = await springApi.post<TransferCreditsResponse>(
        "/api/credits/transfer",
        body
    );
    return data;
}

export async function giftCredits(
    body: AdjustCreditsRequest
): Promise<AdjustCreditsResponse> {
    const { data } = await springApi.post<AdjustCreditsResponse>(
        "/api/credits/transfer",
        { ...body, type: "AWARD" }
    );
    return data;
}

export async function deductCredits(
    body: AdjustCreditsRequest
): Promise<AdjustCreditsResponse> {
    const { data } = await springApi.post<AdjustCreditsResponse>(
        "/api/credits/transfer",
        { ...body, type: "DEDUCT" }
    );
    return data;
}

export async function fetchBalance(): Promise<BonusPointBalanceResponse> {
    const { data } = await springApi.get<BonusPointBalanceResponse>(
        "/api/credits/balance"
    );
    return data;
}
