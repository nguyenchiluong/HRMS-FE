import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createRedeem } from "../api/redeem";
import { RedeemRequest } from "../types/redeem";

// Provides a mutation for creating a withdrawal transaction.
export function useRedeemRequest() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (body: RedeemRequest) => createRedeem(body),
        onSuccess: (response) => {
            const details = `Successfully withdrew ${response.convertedPoint.toLocaleString()} pts → ${response.amountReceived.toLocaleString()} VND`;
            toast.success(details);
            queryClient.invalidateQueries({ queryKey: ["redeemHistory"] });
            queryClient.invalidateQueries({ queryKey: ["redeemBalance"] });
        },
        onError: (err) => {
            const message = isAxiosError(err)
                ? (err.response?.data as { message?: string })?.message || "Withdrawal failed"
                : err instanceof Error
                    ? err.message
                    : "Withdrawal failed";
            toast.error(message);
        },
    });

    return {
        submitRedeem: mutation.mutate,
        isSubmitting: mutation.isPending,
    };
}
