export type TeamMember = {
    id: number;
    name: string;
    email: string;
    position: string | null;
    department: string | null;
    avatar: string | null;
};

export type ViewTeamMembersRequest = {
    page?: number;
    size?: number;
};

export type ViewTeamMembersResponse = {
    teamMembers: TeamMember[];
    totalRecords: number;
};

export type TransferCreditsRequest = {
    recipientId: number;
    points: number;
    note?: string;
};

export type TransferCreditsResponse = {
    success: boolean;
    message: string;
    newBalance?: number;
};

export type AdjustCreditsRequest = {
    recipientId: number;
    points: number;
    note?: string;
};

export type AdjustCreditsResponse = TransferCreditsResponse;

export type BonusPointBalanceResponse = {
    bonusPoint: number;
};
