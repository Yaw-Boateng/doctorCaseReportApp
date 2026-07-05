// src/features/managers/components/TestModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Power, PowerOff, FlaskConical } from "lucide-react";

export const TestModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onToggleStatus,
  testItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    testName: "",
    price: "",
    commission: "",
  });

  useEffect(() => {
    if (testItem) {
      setFormData({
        testName: testItem.testName || "",
        price: testItem.price || "",
        commission: testItem.commission || "",
      });
      setIsEditing(false);
    } else {
      setFormData({
        testName: "",
        price: "",
        commission: "0",
      });
      setIsEditing(true);
    }
    setErrors({});
  }, [testItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.testName.trim()) {
      validationErrors.testName = "Laboratory test name is required";
    }
    if (!String(formData.price).trim() || Number(formData.price) < 0) {
      validationErrors.price = "Valid operational cost required";
    }
    if (!String(formData.commission).trim() || Number(formData.commission) < 0) {
      validationErrors.commission = "Valid commission rate required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      testName: formData.testName,
      price: Number(formData.price),
      commission: Number(formData.commission),
    });
  };

  const isActive = testItem?.status === "ACTIVE" || testItem?.active === true;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* REMOVED hardcoded text-white/90 -> CHANGED to text-foreground to inherit theme engine tokens */}
      <DialogContent className="sm:max-w-[500px] p-6 gap-5 rounded-xl border border-border/60 bg-card shadow-lg text-foreground">
        <DialogHeader className="space-y-1 text-left border-b border-border/40 pb-3 pr-6">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center flex-wrap gap-2">
            <FlaskConical className="h-5 w-5 text-primary shrink-0" />
            <span>
              {testItem
                ? isEditing
                  ? "Modify Diagnostic Parameter"
                  : "Laboratory Parameter Profile"
                : "Provision New Diagnostic Test"}
            </span>
            {testItem && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`text-[10px] uppercase font-bold py-0.5 border ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-normal">
            Configure system diagnostic operational parameters, baselines, and commission payouts.
          </DialogDescription>
        </DialogHeader>

        {testItem && !isEditing && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-muted border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium pl-1">
              Catalog Scope Actions:
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 text-[11px] gap-1 hover:bg-card text-foreground"
              >
                <Edit2 className="h-3 w-3 text-muted-foreground" /> Edit Profile
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(testItem)}
                className="h-7 text-[11px] gap-1 hover:bg-card text-foreground"
              >
                {isActive ? (
                  <PowerOff className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                ) : (
                  <Power className="h-3 w-3 text-emerald-600 dark:text-emerald-500" />
                )}
                {isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(testItem.id);
                  onClose();
                }}
                className="h-7 text-[11px] gap-1 hover:bg-destructive/10 text-destructive font-medium"
              >
                <Trash2 className="h-3 w-3" /> Delete Entry
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label
              htmlFor="testName"
              className="text-xs font-semibold text-muted-foreground"
            >
              Test Name
            </Label>
            <Input
              id="testName"
              disabled={!isEditing}
              placeholder="e.g. Full Blood Count"
              value={formData.testName}
              onChange={(e) =>
                setFormData({ ...formData, testName: e.target.value })
              }
              className={`h-9 bg-background text-sm text-foreground placeholder:text-muted-foreground/70 ${
                errors.testName ? "border-destructive focus-visible:ring-destructive" : "border-border"
              }`}
            />
            {errors.testName && (
              <span className="text-[10px] font-medium text-destructive">
                {errors.testName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="price"
                className="text-xs font-semibold text-muted-foreground"
              >
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                disabled={!isEditing}
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`h-9 bg-background text-sm text-foreground placeholder:text-muted-foreground/70 ${
                  errors.price ? "border-destructive focus-visible:ring-destructive" : "border-border"
                }`}
              />
              {errors.price && (
                <span className="text-[10px] font-medium text-destructive">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="commission"
                className="text-xs font-semibold text-muted-foreground"
              >
                Commission
              </Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                disabled={!isEditing}
                placeholder="0.00"
                value={formData.commission}
                onChange={(e) =>
                  setFormData({ ...formData, commission: e.target.value })
                }
                className={`h-9 bg-background text-sm text-foreground placeholder:text-muted-foreground/70 ${
                  errors.commission ? "border-destructive focus-visible:ring-destructive" : "border-border"
                }`}
              />
              {errors.commission && (
                <span className="text-[10px] font-medium text-destructive">
                  {errors.commission}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/40 mt-4 flex items-center justify-end gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 font-medium text-muted-foreground hover:text-foreground border-border bg-background"
            >
              Cancel
            </Button>
            {isEditing && (
              <Button
                type="submit"
                className="h-8 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                Save Test Configuration
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};