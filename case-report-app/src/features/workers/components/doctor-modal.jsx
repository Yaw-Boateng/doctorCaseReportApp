import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Power, PowerOff } from "lucide-react";

export const DoctorModal = ({ isOpen, onClose, onSave, onDelete, onToggleStatus, doctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialtyName: "",
    hospitalName: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        phoneNumber: doctor.phoneNumber || "",
        specialtyName: doctor.specialtyName || doctor.specialty || "",
        hospitalName: doctor.hospitalName || "",
      });
      setIsEditing(false);
    } else {
      setFormData({ fullName: "", email: "", phoneNumber: "", specialtyName: "", hospitalName: "" });
      setIsEditing(true);
    }
    setErrors({});
  }, [doctor, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!formData.fullName.trim()) validationErrors.fullName = "Full name is required";
    if (!formData.email.trim()) validationErrors.email = "Email address is required";
    if (!formData.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required";
    if (!formData.specialtyName.trim()) validationErrors.specialtyName = "Specialty designation is required";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  const isActive = doctor?.status === "ACTIVE";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 🌟 FIXED RESPONSIVENESS: Ensured the modal content respects dynamic mobile viewport scale targets */}
      <DialogContent className="w-[calc(100%-2rem)] max-w-[520px] mx-auto p-5 sm:p-6 gap-4 rounded-xl border border-border/60 bg-background shadow-lg text-white/90 max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="space-y-1 text-left flex flex-row items-start justify-between border-b border-border/40 pb-3">
          <div className="space-y-1 pr-4">
            <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {doctor ? (isEditing ? "Modify Operational Settings" : "Doctor Profile Overview") : "Register New Doctor"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-normal">
              {doctor ? "Review systemic metadata configurations and clinician pathways." : "Provision fresh medical systemic profiles."}
            </DialogDescription>
          </div>
          {doctor && (
            <Badge variant={isActive ? "success" : "secondary"} className="text-[9px] uppercase font-bold shrink-0 mt-0.5">
              {doctor.status}
            </Badge>
          )}
        </DialogHeader>

        {/* PROFILE MANAGEMENT BAR */}
        {doctor && !isEditing && (
          // 🌟 FIXED RESPONSIVENESS: Changed flex-row layout behaviors to fit multi-row flow safely on mobile viewports
          <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium pl-0.5">Operational Actions:</span>
            <div className="grid grid-cols-3 gap-1 w-full">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="h-8 text-[11px] gap-1 hover:bg-background px-1"
              >
                <Edit2 className="h-3 w-3" /> <span className="truncate">Edit</span>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => onToggleStatus(doctor)}
                className="h-8 text-[11px] gap-1 hover:bg-background text-foreground/90 px-1"
              >
                {isActive ? <PowerOff className="h-3 w-3 text-warning" /> : <Power className="h-3 w-3 text-success" />}
                <span className="truncate">{isActive ? "Deactivate" : "Activate"}</span>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onDelete(doctor.doctorId);
                  onClose();
                }}
                className="h-8 text-[11px] gap-1 hover:bg-destructive/10 text-destructive hover:text-destructive px-1"
              >
                <Trash2 className="h-3 w-3" /> <span className="truncate">Delete</span>
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-foreground/80">Full Name</Label>
            <Input
              id="fullName"
              disabled={!isEditing}
              placeholder="e.g. Dr. Kwame Express"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`h-9 bg-background/50 disabled:opacity-80 disabled:cursor-default text-sm ${errors.fullName ? "border-destructive" : "border-border/80"}`}
            />
            {errors.fullName && <span className="text-[10px] font-medium text-destructive">{errors.fullName}</span>}
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                disabled={!isEditing}
                placeholder="name@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`h-9 bg-background/50 disabled:opacity-80 disabled:cursor-default text-sm ${errors.email ? "border-destructive" : "border-border/80"}`}
              />
              {errors.email && <span className="text-[10px] font-medium text-destructive">{errors.email}</span>}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground/80">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                disabled={!isEditing}
                placeholder="+233..."
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`h-9 bg-background/50 disabled:opacity-80 disabled:cursor-default text-sm ${errors.phoneNumber ? "border-destructive" : "border-border/80"}`}
              />
              {errors.phoneNumber && <span className="text-[10px] font-medium text-destructive">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="specialtyName" className="text-xs font-semibold text-foreground/80">Clinical Specialty</Label>
            <Input
              id="specialtyName"
              disabled={!isEditing}
              placeholder="e.g. Pediatrics, Cardiology"
              value={formData.specialtyName}
              onChange={(e) => setFormData({ ...formData, specialtyName: e.target.value })}
              className={`h-9 bg-background/50 disabled:opacity-80 disabled:cursor-default text-sm ${errors.specialtyName ? "border-destructive" : "border-border/80"}`}
            />
            {errors.specialtyName && <span className="text-[10px] font-medium text-destructive">{errors.specialtyName}</span>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="hospitalName" className="text-xs font-semibold text-foreground/80">Hospital Assignment</Label>
            <Input
              id="hospitalName"
              disabled={!isEditing}
              placeholder="e.g. Korle Bu Teaching Hospital"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className="h-9 bg-background/50 disabled:opacity-80 disabled:cursor-default text-sm border-border/80"
            />
          </div>

          {/* Modal Footer Controls */}
          <DialogFooter className="pt-3 border-t border-border/40 mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 text-xs">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="h-9 sm:h-8 font-medium text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              Close Window
            </Button>
            {isEditing && (
              <Button 
                type="submit" 
                className="h-9 sm:h-8 font-medium bg-primary text-primary-foreground hover:bg-primary/95 w-full sm:w-auto"
              >
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};