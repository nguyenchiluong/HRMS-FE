import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function RejectDialog({ open, onOpenChange, onConfirm }: RejectDialogProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-6 h-6" />
            <DialogTitle className="text-xl">Reject Submission</DialogTitle>
          </div>
          <DialogDescription>
            Please provide a reason for rejecting this submission. The employee will be notified with this reason.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <Textarea 
                placeholder="e.g., Invalid proof, Duplicate entry, Incorrect date, etc." 
                className="resize-none h-24 focus-visible:ring-red-500"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}