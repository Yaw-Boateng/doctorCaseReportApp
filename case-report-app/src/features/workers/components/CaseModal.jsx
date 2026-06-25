// src/features/managers/components/CaseModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import doctorService from "@/lib/doctorService";
import testService from "@/lib/testService"; 
import { Edit2, Trash2, FileText, Loader2 } from "lucide-react";

export const CaseModal = ({ isOpen, onClose, onSave, onDelete, medicalCase }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  
  const [testsList, setTestsList] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorId: "",
    patientName: "",
    numberOfCases: 1,
    testId: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const loadCliniciansAndTests = async () => {
        try {
          setLoadingDoctors(true);
          const res = await doctorService.getAllDoctors({ page: 0, size: 100 });
          const nestedData = res?.data;
          if (nestedData && Array.isArray(nestedData.content)) {
            setDoctorsList(nestedData.content.filter(doc => doc.status === "ACTIVE"));
          } else if (Array.isArray(nestedData)) {
            setDoctorsList(nestedData.filter(doc => doc.status === "ACTIVE"));
          }
        } catch (err) {
          console.error("Failed fetching background doctor metrics context maps:", err);
        } finally {
          setLoadingDoctors(false);
        }

        try {
          setLoadingTests(true);
          const testRes = await testService.getAllTests({ page: 0, size: 100 });
          const unwrappedTests = testRes?.content || testRes?.data || testRes || [];
          
          if (Array.isArray(unwrappedTests)) {
            setTestsList(unwrappedTests.filter(t => t.status === "ACTIVE" || t.active === true));
          }
        } catch (err) {
          console.error("Failed synchronizing admin procedure inventory metrics:", err);
        } finally {
          setLoadingTests(false);
        }
      };

      loadCliniciansAndTests();
    }
  }, [isOpen]);

  useEffect(() => {
    if (medicalCase) {
      setFormData({
        doctorId: medicalCase.doctorId || "",
        patientName: medicalCase.patientName || "",
        numberOfCases: medicalCase.numberOfCases !== undefined ? medicalCase.numberOfCases : 1,
        testId: medicalCase.testId || "",
      });
      setIsEditing(false);
    } else {
      setFormData({
        doctorId: "",
        patientName: "",
        numberOfCases: 1,
        testId: ""
      });
      setIsEditing(true);
    }
    setErrors({});
  }, [medicalCase, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!formData.doctorId.trim()) validationErrors.doctorId = "Please select an attending professional practitioner";
    if (!formData.patientName.trim()) validationErrors.patientName = "Patient reference context name is required";
    if (!formData.testId.trim()) validationErrors.testId = "Please select a required laboratory test template";
    if (Number(formData.numberOfCases) <= 0) validationErrors.numberOfCases = "Count bounds must exceed zero";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      ...formData,
      numberOfCases: Number(formData.numberOfCases)
    });
  };

  const currentAssignedDoctorName = doctorsList.find(d => d.doctorId === formData.doctorId)?.fullName 
    || medicalCase?.doctorName 
    || "Assigned Medical Practitioner";

  const currentAssignedTestName = testsList.find(t => String(t.id) === String(formData.testId))?.testName 
    || medicalCase?.testName 
    || formData.testId 
    || "Selected Diagnostic Template";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Handled dynamic max widths and margin fallbacks gracefully for mobile devices */}
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[480px] p-4 sm:p-6 gap-5 rounded-xl border border-border/60 bg-background shadow-lg text-white/90 focus-visible:outline-hidden">
        
        <DialogHeader className="space-y-1 text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary/80 shrink-0" />
            <span className="truncate">
              {medicalCase ? (isEditing ? "Modify Case Settings" : "Case Record Insights") : "Log New Case Record"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-normal">
            Verify organizational tracking parameters, diagnostics metrics and metrics indexes.
          </DialogDescription>
        </DialogHeader>

        {medicalCase && !isEditing && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-muted/40 border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium pl-1">Record Pipeline Tools:</span>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-[11px] gap-1 hover:bg-background">
                <Edit2 className="h-3 w-3" /> Edit Entry
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onDelete(medicalCase.caseId);
                  onClose();
                }}
                className="h-7 text-[11px] gap-1 hover:bg-destructive/10 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" /> Purge Case
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Context Name Field */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="patientName" className="text-xs font-semibold text-foreground/80">Patient Reference Name</Label>
            <Input
              id="patientName"
              disabled={!isEditing}
              placeholder="e.g. John Doe"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className={`h-9 bg-background/50 text-sm ${errors.patientName ? "border-destructive" : "border-border/80"}`}
            />
            {errors.patientName && <span className="text-[10px] font-medium text-destructive">{errors.patientName}</span>}
          </div>

          {/* Attending Physician Dropdown */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="doctorId" className="text-xs font-semibold text-foreground/80">Attending Professional Practitioner</Label>
            {isEditing ? (
              <div className="relative">
                <select
                  id="doctorId"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  disabled={loadingDoctors}
                  className={`w-full h-9 px-3 pr-8 text-sm rounded-md border bg-background/50 text-foreground cursor-pointer disabled:opacity-50 appearance-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                    errors.doctorId ? "border-destructive" : "border-border/80"
                  }`}
                >
                  <option value="" className="bg-zinc-950">-- Choose Medical Professional --</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.doctorId} value={doc.doctorId} className="bg-zinc-950">
                      {doc.fullName.startsWith("Dr.") ? doc.fullName : `Dr. ${doc.fullName}`} ({doc.specialty || doc.specialtyName || "General"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 flex items-center pointer-events-none">
                  {loadingDoctors ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-muted-foreground text-[10px]">▼</span>
                  )}
                </div>
              </div>
            ) : (
              <Input
                id="doctorId"
                disabled
                value={currentAssignedDoctorName}
                className="h-9 bg-background/50 text-sm border-border/80 disabled:opacity-90 disabled:cursor-default"
              />
            )}
            {errors.doctorId && <span className="text-[10px] font-medium text-destructive">{errors.doctorId}</span>}
          </div>

          {/* Diagnostic Parameters Row - Stacked on mobile, 2 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Laboratory Test Choice Matrix */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="testId" className="text-xs font-semibold text-foreground/80">Laboratory Test Profile</Label>
              {isEditing ? (
                <div className="relative">
                  <select
                    id="testId"
                    value={formData.testId}
                    onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                    disabled={loadingTests}
                    className={`w-full h-9 px-3 pr-8 text-sm rounded-md border bg-background/50 text-foreground cursor-pointer disabled:opacity-50 appearance-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                      errors.testId ? "border-destructive" : "border-border/80"
                    }`}
                  >
                    <option value="" className="bg-zinc-950">-- Select Test Template --</option>
                    {testsList.map((test) => (
                      <option key={test.id} value={test.id} className="bg-zinc-950">
                        {test.testName} 
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-2.5 flex items-center pointer-events-none">
                    {loadingTests ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <span className="text-muted-foreground text-[10px]">▼</span>
                    )}
                  </div>
                </div>
              ) : (
                <Input
                  id="testId"
                  disabled
                  value={currentAssignedTestName}
                  className="h-9 bg-background/50 text-sm border-border/80 disabled:opacity-90 disabled:cursor-default"
                />
              )}
              {errors.testId && <span className="text-[10px] font-medium text-destructive">{errors.testId}</span>}
            </div>

            {/* Number of Cases Input */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="numberOfCases" className="text-xs font-semibold text-foreground/80">Number of Cases</Label>
              <Input
                id="numberOfCases"
                type="number"
                disabled={!isEditing}
                min="1"
                value={formData.numberOfCases}
                onChange={(e) => setFormData({ ...formData, numberOfCases: e.target.value })}
                className={`h-9 bg-background/50 text-sm ${errors.numberOfCases ? "border-destructive" : "border-border/80"}`}
              />
              {errors.numberOfCases && <span className="text-[10px] font-medium text-destructive">{errors.numberOfCases}</span>}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <DialogFooter className="pt-3 border-t border-border/40 mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 text-xs">
            <Button type="button" variant="outline" onClick={onClose} className="h-9 sm:h-8 font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            {isEditing && (
              <Button type="submit" className="h-9 sm:h-8 font-medium bg-primary text-primary-foreground hover:bg-primary/95">
                Save Case Details
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};