import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createRedeem } from "../api/redeem";
import { RedeemRequest } from "../types/redeem";

// Provides a mutation for creating a redeem-to-cash request.
export function useRedeemRequest() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (body: RedeemRequest) => createRedeem(body),
        onSuccess: (response) => {
            const details = `ID #${response.redeemId} • ${response.amount.toLocaleString()} pts • ${response.status}`;
            toast.success(response.message ?? details);
            queryClient.invalidateQueries({ queryKey: ["redeemHistory"] });
            queryClient.invalidateQueries({ queryKey: ["redeemBalance"] });
        },
        onError: (err) => {
            const message = isAxiosError(err)
                ? (err.response?.data as { message?: string })?.message || "Redeem request failed"
                : err instanceof Error
                    ? err.message
                    : "Redeem request failed";
            toast.error(message);
        },
    });

    return {
        submitRedeem: mutation.mutate,
        isSubmitting: mutation.isPending,
    };
}
