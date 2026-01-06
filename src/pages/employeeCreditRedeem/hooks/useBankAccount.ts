import { useQuery } from "@tanstack/react-query";
import { fetchBankAccount } from "../api/bankAccount";
import { BankAccountRecord } from "../types/bankAccount";

export function useBankAccount() {
    const { data, isLoading, error } = useQuery<BankAccountRecord>({
        queryKey: ["bankAccount"],
        queryFn: fetchBankAccount,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        bankAccount: data,
        isLoading,
        error,
    };
}
