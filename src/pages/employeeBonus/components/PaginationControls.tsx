import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  jumpPageValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onJumpPageChange: (value: string) => void;
  onJumpPageSubmit: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  jumpPageValue,
  onPageChange,
  onPageSizeChange,
  onJumpPageChange,
  onJumpPageSubmit,
}: PaginationControlsProps) {
  // Generate pagination items with ellipsis
  const pageItems = useMemo(() => {
    const items: Array<number | "left-ellipsis" | "right-ellipsis"> = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    items.push(1);
    if (currentPage > 4) items.push("left-ellipsis");

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) items.push(i);

    if (currentPage < totalPages - 3) items.push("right-ellipsis");
    items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startRecord} - {endRecord} of {totalRecords}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pageItems.map((it, idx) =>
            it === "left-ellipsis" || it === "right-ellipsis" ? (
              <span key={`ell-${idx}`} className="px-2">
                …
              </span>
            ) : (
              <Button
                key={it}
                size="sm"
                variant={it === currentPage ? "secondary" : "ghost"}
                onClick={() => onPageChange(Number(it))}
              >
                {it}
              </Button>
            )
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          Next
        </Button>

        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-[80px] text-sm" aria-label="Page size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={jumpPageValue}
            onChange={(e) => onJumpPageChange(e.target.value)}
            placeholder="Go to"
            className="w-16"
            onKeyDown={(e) => {
              if (e.key === "Enter") onJumpPageSubmit();
            }}
            aria-label="Jump to page"
          />
          <Button size="sm" onClick={onJumpPageSubmit}>
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
