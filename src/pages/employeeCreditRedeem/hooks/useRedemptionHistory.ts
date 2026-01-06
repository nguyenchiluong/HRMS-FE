import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRedeemHistory } from "../api/redeem";
import { RedeemHistoryResponse, RedeemStatus } from "../types/redeem";

export function useRedeemHistory() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [status, setStatus] = useState<RedeemStatus | "ALL">("ALL");

    const { data, isLoading, isFetching, error } = useQuery<RedeemHistoryResponse>({
        queryKey: ["redeemHistory", page, pageSize, status],
        queryFn: () =>
            fetchRedeemHistory({
                page,
                size: pageSize,
                status: status === "ALL" ? undefined : status,
            }),
    });

    const totalPages = Math.max(1, Math.ceil((data?.totalRecords ?? 0) / pageSize));

    useEffect(() => {
        setPage(1);
    }, [status]);

    return {
        history: data?.redemptions ?? [],
        totalRecords: data?.totalRecords ?? 0,
        totalPages,
        page,
        pageSize,
        status,
        setPage,
        setPageSize,
        setStatus,
        isLoading,
        isFetching,
        error,
    };
}
