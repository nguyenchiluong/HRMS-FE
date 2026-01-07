import { useMemo, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import {
  ViewCreditsRequest,
  ViewCreditsResponse,
  BalanceHistoryItem,
  TransactionType,
} from "../types/transaction";
import { fetchCredits } from "../api/credits";
import { toDateString } from "../utils/dateFormatters";

export function useCreditsData() {
  const today = new Date();
  const queryClient = useQueryClient();

  const allTypes: TransactionType[] = [
    "MONTHLY",
    "AWARD",
    "TRANSFER_RECEIVED",
    "TRANSFER_SENT",
    "REDEEM",
    "DEDUCT",
  ];

  // State
  const [selected, setSelected] = useState<BalanceHistoryItem | null>(null);
  const [from, setFrom] = useState(toDateString(subDays(today, 30)));
  const [to, setTo] = useState(toDateString(today));
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPage, setJumpPage] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);

  const isInvalidRange = from > to;

  // Reset page when range, pageSize, or types change
  useEffect(() => {
    setPage(1);
  }, [from, to, pageSize, selectedTypes]);

  // Build request body
  const requestBody = useMemo<ViewCreditsRequest>(
    () => ({
      dateRange: { from, to },
      types: selectedTypes.length === 0 ? allTypes : selectedTypes,
      sort: { field: "createdAt", direction: "DESC" },
      page,
      size: pageSize,
    }),
    [from, to, selectedTypes, page, pageSize]
  );

  // Fetch data
  const { data, isLoading, isFetching, error, refetch } = useQuery<ViewCreditsResponse>({
    queryKey: ["credits", requestBody],
    queryFn: () => fetchCredits(requestBody),
    enabled: !isInvalidRange,
    staleTime: 30000,
    gcTime: 30000,
  });

  // Keep previous data while fetching
  const [prevData, setPrevData] = useState<ViewCreditsResponse | null>(null);
  useEffect(() => {
    if (data) setPrevData(data);
  }, [data]);

  const effectiveData = data ?? prevData;

  // Prefetch next page
  useEffect(() => {
    if (!data) return;
    const tp = Math.max(1, Math.ceil(data.totalRecords / pageSize));
    if (page < tp) {
      const nextBody = { ...requestBody, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ["credits", nextBody],
        queryFn: () => fetchCredits(nextBody),
      });
    }
  }, [data, page, pageSize, requestBody, queryClient]);

  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil((effectiveData?.totalRecords ?? 0) / pageSize)
  );

  // Clamp page when total changes
  useEffect(() => {
    if (!effectiveData) return;
    const tp = Math.max(1, Math.ceil(effectiveData.totalRecords / pageSize));
    if (page > tp) setPage(tp);
  }, [effectiveData?.totalRecords, pageSize, page]);

  // Handle jump to page
  const handleJump = () => {
    const n = Number(jumpPage);
    if (!Number.isFinite(n)) return;
    const target = Math.max(1, Math.min(Math.floor(n), totalPages));
    setPage(target);
    setJumpPage("");
  };

  return {
    // Data
    data: effectiveData,
    transactions: effectiveData?.history ?? [],
    currentBalance: effectiveData?.currentBalance,
    totalRecords: effectiveData?.totalRecords ?? 0,

    // States
    from,
    to,
    page,
    pageSize,
    jumpPage,
    selected,
    selectedTypes,
    isLoading,
    isFetching,
    error,
    isInvalidRange,
    totalPages,

    // Handlers
    setFrom,
    setTo,
    setPage,
    setPageSize,
    setJumpPage,
    setSelected,
    setSelectedTypes,
    handleJump,
    refetchBalance: () => refetch({ cancelRefetch: true }),
  };
}
