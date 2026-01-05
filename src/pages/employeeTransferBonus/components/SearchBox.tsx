import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function SearchBox({ value, onChange, disabled }: SearchBoxProps) {
    const [localValue, setLocalValue] = useState(value);

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

    return (
        <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder="Search by name or email"
            className="w-full sm:w-64"
            disabled={disabled}
        />
    );
}
