import * as React from "react";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Revoke & Purge Registry Record",
  description = "This action is permanent and cannot be undone. System access keys will be invalidated and telemetry data unlinked.",
  requireMatchText, // Optional: Pass a string (like the username or "DELETE") to force typing confirmation
  isSubmitting = false,
}) {
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleClose = () => {
    setConfirmationInput("");
    onClose();
  };

  const handleConfirm = () => {
    if (requireMatchText && confirmationInput !== requireMatchText) return;
    onConfirm();
    setConfirmationInput("");
  };

  // Determine if the confirm button should be disabled
  const isConfirmDisabled = 
    isSubmitting || 
    (requireMatchText && confirmationInput !== requireMatchText);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] border-border bg-card p-6 shadow-lg animate-fade-in">
        <DialogHeader className="flex flex-col gap-3">
          {/* Warning Icon Banner */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive border border-destructive/20 self-start">
            <AlertTriangle className="h-4 w-4" />
          </div>
          
          <div className="flex flex-col gap-1.5 text-left">
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Safe guard verification input if text matching is required */}
        {requireMatchText && (
          <div className="my-2 flex flex-col gap-2 text-left">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider select-none">
              Type <span className="font-mono font-bold text-foreground lowercase bg-muted px-1 py-0.5 rounded border border-border/60">"{requireMatchText}"</span> to confirm
            </label>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={`Verify structural context target...`}
              className="h-9 w-full px-3 text-xs font-mono rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/40 focus:border-destructive/40"
              disabled={isSubmitting}
            />
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-9 text-xs border-border text-foreground font-medium px-4 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="h-9 text-xs font-medium px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? "Purging Record..." : "Confirm Deletion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}