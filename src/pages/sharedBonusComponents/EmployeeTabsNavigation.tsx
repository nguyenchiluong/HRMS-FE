import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toDateString } from "../employeeBonus/utils/dateFormatters";
import { fetchCredits } from "../employeeBonus/api/credits";
import { TransactionType } from "../employeeBonus/types/transaction";
import { fetchRedeemBalance } from "../employeeCreditRedeem/api/redeem";
import { fetchBonusSettings } from "../employeeCreditRedeem/api/settings";
import { fetchBankAccount } from "../employeeCreditRedeem/api/bankAccount";
import { fetchTeamMembers, fetchBalance } from "../employeeTransferBonus/api/teamMembers";

export const EmployeeTabsNavigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Prefetch data for all three tabs so navigation feels instant after a hard refresh on any page.
    useEffect(() => {
        const today = new Date();
        const creditsBody = {
            dateRange: {
                from: toDateString(subDays(today, 30)),
                to: toDateString(today),
            },
            types: [
                "MONTHLY",
                "AWARD",
                "TRANSFER_RECEIVED",
                "TRANSFER_SENT",
                "REDEEM",
                "DEDUCT",
            ] as TransactionType[],
            sort: { field: "createdAt", direction: "DESC" as const },
            page: 1,
            size: 10,
        };

        queryClient.prefetchQuery({
            queryKey: ["credits", creditsBody],
            queryFn: () => fetchCredits(creditsBody),
        });

        queryClient.prefetchQuery({
            queryKey: ["redeemBalance"],
            queryFn: fetchRedeemBalance,
        });

        queryClient.prefetchQuery({
            queryKey: ["bonusSettings"],
            queryFn: fetchBonusSettings,
        });

        queryClient.prefetchQuery({
            queryKey: ["bankAccount"],
            queryFn: fetchBankAccount,
        });

        queryClient.prefetchQuery({
            queryKey: ["bonusBalance"],
            queryFn: fetchBalance,
        });

        queryClient.prefetchQuery({
            queryKey: ["teamMembers", 1, 10, ""],
            queryFn: () => fetchTeamMembers({ page: 1, size: 10 }),
        });
    }, [queryClient]);

    // Determine active tab based on current path
    const getActiveTab = () => {
        if (location.pathname.includes("/credits/transfer")) return "transfer";
        if (location.pathname.includes("/credits/redeem")) return "redeem";
        return "bonus";
    };

    const activeTab = getActiveTab();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <Tabs value={activeTab} onValueChange={(value) => {
            switch (value) {
                case "bonus":
                    handleNavigate("/employee/credits");
                    break;
                case "redeem":
                    handleNavigate("/employee/credits/redeem");
                    break;
                case "transfer":
                    handleNavigate("/employee/credits/transfer");
                    break;
            }
        }}>
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="bonus">Balance History</TabsTrigger>
                <TabsTrigger value="redeem">Redeem Credits</TabsTrigger>
                <TabsTrigger value="transfer">Transfer Credits</TabsTrigger>
            </TabsList>
        </Tabs>
    );
};
