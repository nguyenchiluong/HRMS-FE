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
    search?: string;
};

export type ViewTeamMembersResponse = {
    teamMembers: TeamMember[];
    totalRecords: number;
    role: "USER" | "MANAGER" | "HR" | "ADMIN";
};

export type TransferCreditsRequest = {
    receiverId: number;
    points: number;
    note?: string;
    type?: "TRANSFER" | "REDEEM" | "DEDUCT" | "AWARD" | "MONTHLY";
};

export type TransferCreditsResponse = {
    transferId: number;
    numberPoint: number;
    note?: string;
    type: "TRANSFER" | "REDEEM" | "DEDUCT" | "AWARD" | "MONTHLY";
    createdAt: string;
};

export type AdjustCreditsRequest = {
    receiverId: number;
    points: number;
    note?: string;
    type?: "TRANSFER" | "REDEEM" | "DEDUCT" | "AWARD" | "MONTHLY";
};

export type AdjustCreditsResponse = {
    transferId: number;
    numberPoint: number;
    note?: string;
    type: "TRANSFER" | "REDEEM" | "DEDUCT" | "AWARD" | "MONTHLY";
    createdAt: string;
};

export type BonusPointBalanceResponse = {
    bonusPoint: number;
};
