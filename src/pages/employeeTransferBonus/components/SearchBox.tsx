import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    isFetching?: boolean;
}

export function SearchBox({ value, onChange, disabled, isFetching }: SearchBoxProps) {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce the search to avoid excessive refetches
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    // Sync external value changes to local state
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Restore focus when refetching completes
    useEffect(() => {
        if (!isFetching && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFetching]);

    return (
        <Input
            ref={inputRef}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder="Search by name or email"
            className="w-full sm:w-64"
            disabled={disabled}
        />
    );
}
