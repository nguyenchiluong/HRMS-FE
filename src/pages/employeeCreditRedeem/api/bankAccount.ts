import springApi from "@/api/spring";
import { BankAccountRecord } from "../types/bankAccount";

export async function fetchBankAccount(): Promise<BankAccountRecord> {
    const response = await springApi.get<BankAccountRecord>("/api/bankaccount/me");
    return response.data;
}
