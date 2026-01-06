import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    disabled?: boolean;
}

export function PaginationControls({
    page,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    disabled = false,
}: PaginationControlsProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                    disabled={disabled}
                >
                    <SelectTrigger className="w-[70px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={disabled || page <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={disabled || page >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
