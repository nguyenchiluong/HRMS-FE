import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, subDays, startOfMonth } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --------------------
// Types
// --------------------

type TransactionType =
  | "REDEEM"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "DEDUCT"
  | "AWARD"
  | "MONTHLY";

type BalanceHistoryItem = {
  id: number;
  type: TransactionType;
  points: number;
  amount: number | null;
  note: string | null;
  counterpartyId: number | null;
  counterpartyName: string | null;
  currency: string | null;
  createdAt: string;
};

type ViewCreditsRequest = {
  dateRange: {
    from: string;
    to: string;
  };
  types: TransactionType[];
  sort: {
    field: "createdAt";
    direction: "ASC" | "DESC";
  };
  page?: number;
  size?: number;
};

type ViewCreditsResponse = {
  empId: number;
  currentBalance: number;
  totalRedeemed: number | null;
  totalSent: number | null;
  totalReceived: number | null;
  totalRecords: number;
  history: BalanceHistoryItem[];
};

type TransactionMeta = {
  label: string;
  isCredit: boolean;
  badgeVariant: "default" | "secondary" | "destructive";
};

// --------------------
// Metadata
// --------------------

const TRANSACTION_META: Record<TransactionType, TransactionMeta> = {
  REDEEM: { label: "Redeemed", isCredit: false, badgeVariant: "destructive" },
  TRANSFER_SENT: {
    label: "Transfer Sent",
    isCredit: false,
    badgeVariant: "destructive",
  },
  TRANSFER_RECEIVED: {
    label: "Transfer Received",
    isCredit: true,
    badgeVariant: "default",
  },
  DEDUCT: {
    label: "Deduction",
    isCredit: false,
    badgeVariant: "secondary",
  },
  AWARD: { label: "Award", isCredit: true, badgeVariant: "default" },
  MONTHLY: { label: "Monthly Bonus", isCredit: true, badgeVariant: "default" },
};

// --------------------
// Helpers
// --------------------
const truncateText = (text: string, max = 60) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const toDateString = (date: Date) =>
  format(date, "yyyy-MM-dd");

const formatDate = (date: string) =>
  format(new Date(date), "dd MMM yyyy");

const formatTime = (date: string) =>
  format(new Date(date), "HH:mm");

// --------------------
// API
// --------------------

async function fetchCredits(
  body: ViewCreditsRequest
): Promise<ViewCreditsResponse> {
  const res = await fetch("http://localhost:8080/api/credits/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to fetch credits");
  return res.json();
}

// --------------------
// Component
// --------------------

export default function ViewCredits() {
  const today = new Date();

  const [selected, setSelected] =
    useState<BalanceHistoryItem | null>(null);

  // Default = last 30 days
  const [from, setFrom] = useState(
    toDateString(subDays(today, 30))
  );
  const [to, setTo] = useState(toDateString(today));

  const isInvalidRange = from > to;

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reset to first page when range or page size changes
  useEffect(() => {
    setPage(1);
  }, [from, to, pageSize]);

  // Memoized request body (stable reference)
  const requestBody = useMemo<ViewCreditsRequest>(
    () => ({ 
      dateRange: { from, to },
      types: [
        "REDEEM",
        "TRANSFER_SENT",
        "TRANSFER_RECEIVED",
        "AWARD",
        "DEDUCT",
        "MONTHLY",
      ],
      sort: { field: "createdAt", direction: "DESC" },
      page,
      size: pageSize,
    }),
    [from, to, page, pageSize]
  );

  const queryClient = useQueryClient();
  const [jumpPage, setJumpPage] = useState<string>("");

  // Query the server for the requested page
  const { data, isLoading, isFetching, error } = useQuery<ViewCreditsResponse>({
    queryKey: ["credits", requestBody],
    queryFn: () => fetchCredits(requestBody),
    enabled: !isInvalidRange,
  });

  // Keep last successful response to avoid blank UI while fetching next page
  const [prevData, setPrevData] = useState<ViewCreditsResponse | null>(null);
  useEffect(() => {
    if (data) setPrevData(data);
  }, [data]);

  const effectiveData = data ?? prevData;

  // Prefetch next page when available (typed single-arg form)
  useEffect(() => {
    if (!data) return;
    const tp = Math.max(1, Math.ceil(data.totalRecords / pageSize));
    if (page < tp) {
      const nextBody = { ...requestBody, page: page + 1 };
      queryClient.prefetchQuery({ queryKey: ["credits", nextBody], queryFn: () => fetchCredits(nextBody) });
    }
  }, [data, page, pageSize, requestBody, queryClient]);

  const totalPages = Math.max(1, Math.ceil((effectiveData?.totalRecords ?? 0) / pageSize));

  const pageItems = useMemo(() => {
    const tp = totalPages;
    const items: Array<number | "left-ellipsis" | "right-ellipsis"> = [];

    if (tp <= 7) {
      for (let i = 1; i <= tp; i++) items.push(i);
      return items;
    }

    items.push(1);
    if (page > 4) items.push("left-ellipsis");

    const start = Math.max(2, page - 2);
    const end = Math.min(tp - 1, page + 2);
    for (let i = start; i <= end; i++) items.push(i);

    if (page < tp - 3) items.push("right-ellipsis");
    items.push(tp);

    return items;
  }, [page, totalPages]);

  const handleJump = () => {
    const n = Number(jumpPage);
    if (!Number.isFinite(n)) return;
    const target = Math.max(1, Math.min(Math.floor(n), totalPages));
    setPage(target);
    setJumpPage("");
  };

  // Clamp page when totalRecords/pageSize change
  useEffect(() => {
    if (!effectiveData) return;
    const tp = Math.max(1, Math.ceil(effectiveData.totalRecords / pageSize));
    if (page > tp) setPage(tp);
  }, [effectiveData?.totalRecords, pageSize, page]);

  // Server-side pagination: trust the server to return the correct page
  const displayRows = useMemo(() => effectiveData?.history ?? [], [effectiveData]);

  // --------------------
  // Loading
  // --------------------

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // --------------------
  // Error
  // --------------------

  if (error || !data) {
    return (
      <div className="p-6 text-red-500">
        Failed to load transactions
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          {/* Summary */}
          <div className="w-full md:max-w-[240px]">
            <Card className="w-full md:w-auto">
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {effectiveData?.currentBalance != null ? effectiveData.currentBalance.toLocaleString() : "—"} pts
            </CardContent>
          </Card>          </div>
          <div className="space-y-6">
            {/* Date Range */}
            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Presets */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFrom(toDateString(subDays(today, 7)));
                      setTo(toDateString(today));
                    }}
                  >
                    Last 7 days
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFrom(toDateString(subDays(today, 30)));
                      setTo(toDateString(today));
                    }}
                  >
                    Last 30 days
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFrom(
                        toDateString(startOfMonth(today))
                      );
                      setTo(toDateString(today));
                    }}
                  >
                    This month
                  </Button>
                </div>

                {/* Custom range */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      type="date"
                      value={from}
                      max={to}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      type="date"
                      value={to}
                      min={from}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>
                </div>

                {isInvalidRange && (
                  <p className="text-sm text-red-500">
                    “From” date cannot be after “To” date
                  </p>
                )}
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Transaction History
                  {isFetching && (
                    <span className="ml-2 text-xs text-muted-foreground">Updating…</span>
                  )}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({effectiveData?.totalRecords ?? 0})
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {displayRows.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground">
                    No transactions in the selected date range
                  </div>
                ) : (
                  <>
                    <Table className="table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[35%]">
                            Transaction
                          </TableHead>

                          <TableHead className="w-[25%]">
                            Note
                          </TableHead>

                          <TableHead className="w-[20%]">
                            Date
                          </TableHead>

                          <TableHead className="w-[20%] text-right">
                            Points
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {displayRows.map((item) => {
                          const meta = TRANSACTION_META[item.type];

                          return (
                            <TableRow
                              key={item.id}
                              role="button"
                              tabIndex={0}
                              className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors"
                              onClick={() => setSelected(item)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setSelected(item);
                                }
                              }}
                            >
                              {/* Transaction */}
                              <TableCell className="truncate">
                                <div className="font-medium truncate">
                                  {meta.label}
                                </div>

                                {item.counterpartyName && (
                                  <div className="text-sm text-muted-foreground truncate">
                                    {meta.isCredit ? "From" : "To"}{" "}
                                    {item.counterpartyName}
                                  </div>
                                )}
                              </TableCell>

                              {/* Note */}
                              <TableCell
                                className="truncate text-sm text-muted-foreground"
                                title={item.note ?? undefined}
                              >
                                {item.note
                                  ? truncateText(item.note)
                                  : "—"}
                              </TableCell>

                              {/* Date */}
                              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                {formatDate(item.createdAt)}
                                <div className="text-xs">
                                  {formatTime(item.createdAt)}
                                </div>
                              </TableCell>

                              {/* Points */}
                              <TableCell
                                className={`whitespace-nowrap text-right font-semibold ${meta.isCredit
                                    ? "text-green-600"
                                    : "text-red-600"}`}
                              >
                                {meta.isCredit ? "+" : "-"}
                                {Math.abs(item.points).toLocaleString()} pts
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, effectiveData?.totalRecords ?? 0)} of {effectiveData?.totalRecords ?? 0}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {pageItems.map((it, idx) =>
                            it === "left-ellipsis" || it === "right-ellipsis" ? (
                              <span key={`ell-${idx}`} className="px-2">…</span>
                            ) : (
                              <Button
                                key={it}
                                size="sm"
                                variant={it === page ? "secondary" : "ghost"}
                                onClick={() => setPage(Number(it))}
                              >
                                {it}
                              </Button>
                            )
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                          Next
                        </Button>

                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => setPageSize(Number(v))}
                      aria-label="Page size"
                    >
                      <SelectTrigger className="w-[80px] ml-2 text-sm">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="ml-3 flex items-center gap-2">
                      <Input
                        type="number"
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        placeholder="Go to"
                        className="w-16"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleJump();
                        }}
                        aria-label="Jump to page"
                      />

                      <Button size="sm" onClick={handleJump}>
                        Go
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Drawer */}
      <Sheet
        open={!!selected}
        onOpenChange={() => setSelected(null)}
      >
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>
                  Transaction Details
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <strong>Type:</strong>{" "}
                  {
                    TRANSACTION_META[selected.type]
                      .label
                  }
                </div>

                <div>
                  <strong>Date:</strong>{" "}
                  {format(
                    new Date(selected.createdAt),
                    "dd MMM yyyy HH:mm"
                  )}
                </div>

                <div>
                  <strong>Points:</strong>{" "}
                  {selected.points}
                </div>

                {selected.amount != null &&
                  selected.currency && (
                    <div>
                      <strong>Amount:</strong>{" "}
                      {selected.amount}{" "}
                      {selected.currency}
                    </div>
                  )}

                {selected.note && (
                  <div>
                    <strong>Note:</strong>
                    <div className="mt-1 text-muted-foreground">
                      {selected.note}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      </div>
    </div>
  </div>
  );
}
