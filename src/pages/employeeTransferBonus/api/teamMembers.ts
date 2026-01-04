import springApi from "@/api/spring";
import {
    ViewTeamMembersRequest,
    ViewTeamMembersResponse,
    TransferCreditsRequest,
    TransferCreditsResponse,
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
