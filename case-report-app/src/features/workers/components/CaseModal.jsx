import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import doctorService from "@/lib/doctorService";
import testService from "@/lib/testService"; 
import { Edit2, Trash2, FileText, Loader2, Check, ChevronDown, ChevronUp, X } from "lucide-react";

export const CaseModal = ({ isOpen, onClose, onSave, onDelete, medicalCase, isSubmitting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  
  const [testsList, setTestsList] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorId: "",
    patientName: "",
    numberOfCases: 1,
    testIds: []
  });
  const [errors, setErrors] = useState({});

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          
          let unwrappedTests = [];
          
          // Exactly matching your TestManagement data unpacking workflow standard 
          if (testRes && testRes.success && testRes.data) {
            if (Array.isArray(testRes.data.content)) {
              unwrappedTests = testRes.data.content;
            }
          } else if (testRes && Array.isArray(testRes.content)) {
            unwrappedTests = testRes.content;
          } else if (testRes && Array.isArray(testRes.data)) {
            unwrappedTests = testRes.data;
          } else if (Array.isArray(testRes)) {
            unwrappedTests = testRes;
          }
          
          // Filter to show only active configurations
          setTestsList(unwrappedTests.filter(t => t.status === "ACTIVE" || t.active === true));
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
      const extractedIds = Array.isArray(medicalCase.tests)
        ? medicalCase.tests.map((t) => t.id)
        : medicalCase.testIds || [];

      setFormData({
        doctorId: medicalCase.doctorId || "",
        patientName: medicalCase.patientName || "",
        numberOfCases: medicalCase.numberOfCases !== undefined ? medicalCase.numberOfCases : 1,
        testIds: extractedIds,
      });
      setIsEditing(false);
    } else {
      setFormData({
        doctorId: "",
        patientName: "",
        numberOfCases: 1,
        testIds: []
      });
      setIsEditing(true);
    }
    setErrors({});
    setDropdownOpen(false);
  }, [medicalCase, isOpen]);

  const handleToggleTest = (id) => {
    if (!isEditing) return;
    
    setFormData((prev) => {
      const isSelected = prev.testIds.includes(id);
      const updatedIds = isSelected
        ? prev.testIds.filter((testId) => testId !== id)
        : [...prev.testIds, id];
      return { ...prev, testIds: updatedIds };
    });
  };

  const handleRemoveTest = (id, e) => {
    e.stopPropagation(); 
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      testIds: prev.testIds.filter(testId => testId !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!formData.doctorId.trim()) validationErrors.doctorId = "Please select an attending professional practitioner";
    if (!formData.patientName.trim()) validationErrors.patientName = "Patient reference context name is required";
    if (formData.testIds.length === 0) validationErrors.testIds = "Please select at least one laboratory test profile";
    if (formData.numberOfCases <= 0) validationErrors.numberOfCases = "Count bounds must exceed zero";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      doctorId: formData.doctorId,
      patientName: formData.patientName,
      numberOfCases: Number(formData.numberOfCases),
      testIds: formData.testIds
    });
  };

  const currentAssignedDoctorName = doctorsList.find(d => d.doctorId === formData.doctorId)?.fullName 
    || medicalCase?.doctorName 
    || "Assigned Medical Practitioner";

  const selectedTestsObjects = testsList.filter(t => formData.testIds.includes(t.id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[480px] p-4 sm:p-6 gap-5 rounded-xl border border-border/60 bg-card shadow-lg text-foreground focus-visible:outline-hidden">
        
        <DialogHeader className="space-y-1 text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate">
              {medicalCase ? (isEditing ? "Modify Case Settings" : "Case Record Insights") : "Log New Case Record"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-normal">
            Verify organizational tracking parameters, diagnostics metrics and metrics indexes.
          </DialogDescription>
        </DialogHeader>

        {medicalCase && !isEditing && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-muted border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium pl-1">Record Pipeline Tools:</span>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-[11px] gap-1 hover:bg-card text-foreground">
                <Edit2 className="h-3 w-3 text-muted-foreground" /> Edit Entry
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                disabled={isSubmitting} 
                onClick={() => {
                  const recordKey = medicalCase.id || medicalCase.caseId;
                  onDelete(recordKey);
                  onClose();
                }}
                className="h-7 text-[11px] gap-1 hover:bg-destructive/10 text-destructive font-medium"
              >
                <Trash2 className="h-3 w-3" /> Delete Case
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name Field */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="patientName" className="text-xs font-semibold text-muted-foreground">Patient Reference Name</Label>
            <Input
              id="patientName"
              disabled={!isEditing || isSubmitting} 
              placeholder="e.g. John Doe"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className={`h-9 bg-background text-sm text-foreground placeholder:text-muted-foreground/70 ${
                errors.patientName ? "border-destructive focus-visible:ring-destructive" : "border-border"
              }`}
            />
            {errors.patientName && <span className="text-[10px] font-medium text-destructive">{errors.patientName}</span>}
          </div>

          {/* Attending Physician Dropdown */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="doctorId" className="text-xs font-semibold text-muted-foreground">Attending Professional Practitioner</Label>
            {isEditing ? (
              <div className="relative">
                <select
                  id="doctorId"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  disabled={loadingDoctors || isSubmitting} 
                  className={`w-full h-9 px-3 pr-8 text-sm rounded-md border bg-background text-foreground cursor-pointer disabled:opacity-50 appearance-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                    errors.doctorId ? "border-destructive" : "border-border"
                  }`}
                >
                  <option value="" className="bg-card text-foreground">-- Choose Medical Professional --</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.doctorId} value={doc.doctorId} className="bg-card text-foreground">
                      {doc.fullName?.startsWith("Dr.") ? doc.fullName : `Dr. ${doc.fullName}`} ({doc.specialty || doc.specialtyName || "General"})
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
                className="h-9 bg-background text-sm border-border text-foreground disabled:opacity-90 disabled:cursor-default"
              />
            )}
            {errors.doctorId && <span className="text-[10px] font-medium text-destructive">{errors.doctorId}</span>}
          </div>

          {/* Collapsible Select Option Field */}
          <div className="flex flex-col space-y-1.5 relative" ref={dropdownRef}>
            <Label className="text-xs font-semibold text-muted-foreground">Laboratory Test Profile</Label>
            
            {isEditing ? (
              <>
                <div
                  onClick={() => !loadingTests && !isSubmitting && setDropdownOpen(!dropdownOpen)} 
                  className={`min-h-9 w-full px-3 py-1.5 flex items-center justify-between rounded-md border bg-background cursor-pointer transition-all ${
                    errors.testIds ? "border-destructive" : "border-border"
                  } ${(loadingTests || isSubmitting) ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
                    {selectedTestsObjects.length === 0 ? (
                      <span className="text-sm text-muted-foreground">-- Select Test Templates --</span>
                    ) : (
                      selectedTestsObjects.map((test) => (
                        <span 
                          key={test.id} 
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-sm border border-primary/20"
                        >
                          {test.testName}
                          <X 
                            className="h-3 w-3 hover:text-foreground cursor-pointer" 
                            onClick={(e) => !isSubmitting && handleRemoveTest(test.id, e)} 
                          />
                        </span>
                      ))
                    )}
                  </div>
                  <div className="shrink-0 text-muted-foreground pl-2">
                    {loadingTests ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : dropdownOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-card border border-border rounded-md shadow-xl z-50 max-h-[200px] overflow-y-auto scrollbar-thin divide-y divide-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
                    {testsList.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">No active diagnostic tests available.</div>
                    ) : (
                      testsList.map((test) => {
                        const isChecked = formData.testIds.includes(test.id);
                        return (
                          <div
                            key={test.id}
                            onClick={() => !isSubmitting && handleToggleTest(test.id)}
                            className="flex items-center justify-between p-2.5 hover:bg-muted text-xs font-medium cursor-pointer transition-colors group text-foreground"
                          >
                            <div className="flex flex-col gap-0.5 truncate">
                              <span className="truncate font-medium">{test.testName}</span>
                              {test.price > 0 && (
                                <span className="text-[10px] text-muted-foreground font-mono">Price: ${test.price}</span>
                              )}
                            </div>
                            <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                              isChecked ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-muted-foreground/60"
                            }`}>
                              {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="min-h-9 w-full px-3 py-1.5 flex flex-wrap gap-1 items-center rounded-md border border-border bg-background disabled:opacity-90">
                {selectedTestsObjects.length === 0 ? (
                  <span className="text-sm text-foreground/80">General Profile Scan</span>
                ) : (
                  selectedTestsObjects.map((test) => (
                    <span key={test.id} className="inline-flex text-[11px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-sm border border-border">
                      {test.testName}
                    </span>
                  ))
                )}
              </div>
            )}
            {errors.testIds && <span className="text-[10px] font-medium text-destructive">{errors.testIds}</span>}
          </div>  

          {/* Dialog Action Buttons */}
          <DialogFooter className="pt-3 border-t border-border/40 mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 text-xs">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="h-9 sm:h-8 font-medium text-muted-foreground hover:text-foreground border-border bg-background"
            >
              Cancel
            </Button>
            {isEditing && (
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="h-9 sm:h-8 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs flex items-center justify-center gap-1.5 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Case Details"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};