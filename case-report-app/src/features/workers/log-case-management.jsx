import React, { useState, useEffect, useCallback } from "react"; // 👈 Removed useMemo since filtering happens server-side now
import caseService from "@/lib/caseService";
import { CaseFilters } from "./components/CaseFilters";
import { CaseModal } from "./components/CaseModal";
import { CaseTable } from "./components/CaseTable";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { Loader } from "@/components/ui/loader";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { useToast } from "@/components/ToastContext";

const ITEMS_PER_PAGE = 10;

export default function CaseManagement() {
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);         
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);                     // 0-indexed page tracker synced perfectly with backend
  const [totalPages, setTotalPages] = useState(0);         // 👈 Added state to capture server totalPages pagination boundary

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToDelete, setCaseToDelete] = useState(null);

  const { addToast } = useToast();

  // 👈 Modified to accept parameters for server execution loops
  const fetchAllCases = useCallback(async () => {
    try {
      setLoading(true);
      
      // Pass pagination query elements directly to your API service matching schema parameters
      // If your API supports server-side searching, you can append `search: searchTerm` here as well
      const response = await caseService.getAllCases({ 
        page: page, 
        size: ITEMS_PER_PAGE 
      });
      
      const nestedData = response?.data;
      
      if (nestedData && Array.isArray(nestedData.content)) {
        setAllCases(nestedData.content);
        setTotalPages(nestedData.totalPages || 0); // 👈 Safely update total pages from API response data matrix
      } else if (response && Array.isArray(response.content)) {
        setAllCases(response.content);
        setTotalPages(response.totalPages || 0);
      } else {
        setAllCases([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to sync case matrix tracking lines:", error);
      setAllCases([]);
      setTotalPages(0);
      
      addToast({
        type: "error",
        title: "Telemetry Sync Error",
        description: "Failed to fetch diagnostic records from the network catalog ledger.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [page, addToast]); // 👈 Added page dependency to re-fetch when page changes

  // Re-run anytime the page index shifts via the Pagination Wrapper buttons
  useEffect(() => {
    fetchAllCases();
  }, [fetchAllCases]);

  // Client-side search optimization (If your backend doesn't support an explicit search endpoint flag)
  const filteredCases = React.useMemo(() => {
    if (!searchTerm.trim()) return allCases;

    const lowerSearch = searchTerm.toLowerCase();
    return allCases.filter((item) => {
      const patientName = item?.patientName?.toLowerCase() || "";
      const doctorName = item?.doctorName?.toLowerCase() || "";
      const recordId = (item?.id || item?.caseId || "").toLowerCase();

      return (
        patientName.includes(lowerSearch) ||
        doctorName.includes(lowerSearch) ||
        recordId.includes(lowerSearch)
      );
    });
  }, [allCases, searchTerm]);

  const handleOpenAddModal = () => {
    setSelectedCase(null);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (item) => {
    setSelectedCase(item);
    setIsModalOpen(true);
  };

  const handleSaveCase = async (formData) => {
    try {
      setIsSaving(true);
      
      if (selectedCase) {
        const targetId = selectedCase.id || selectedCase.caseId;
        await caseService.updateCase(targetId, formData);
        
        addToast({
          type: "success",
          title: "Incident Updated",
          description: `Successfully synchronized case metrics for patient: ${formData.patientName || "Unassigned"}.`,
          duration: 4000
        });
      } else {
        await caseService.createCase(formData);
        
        addToast({
          type: "success",
          title: "Case Initialized",
          description: `A fresh tracking sequence has been provisioned for ${formData.patientName || "Unassigned"}.`,
          duration: 4500
        });
      }
      setIsModalOpen(false);
      fetchAllCases();
    } catch (error) {
      console.error("Persisting operations mutations failed on target endpoint context:", error);
      addToast({
        type: "error",
        title: "Mutation Terminated",
        description: error.response?.data?.message || "Validation failed while compiling metadata payload parameters.",
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerDeletePrompt = (caseId) => {
    const targetCase = allCases.find((c) => (c.id === caseId || c.caseId === caseId)) || selectedCase;
    if (!targetCase) return;

    setCaseToDelete(targetCase);
    setIsDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!caseToDelete) return;
    const targetId = caseToDelete.id || caseToDelete.caseId;
    
    setIsSubmitting(true);
    try {
      await caseService.deleteCase(targetId);
      
      addToast({
        type: "error",
        title: "Tracking File Purged",
        description: "The targeted workspace tracking indices were completely dropped from database streams.",
        duration: 4500
      });

      setIsDeleteModalOpen(false);
      
      const currentSelectedId = selectedCase?.id || selectedCase?.caseId;
      if (currentSelectedId === targetId) {
        setIsModalOpen(false);
      }
      
      setCaseToDelete(null);
      fetchAllCases();
    } catch (error) {
      console.error("Purging transactional log case records context failed execution:", error);
      addToast({
        type: "error",
        title: "Purge Command Blocked",
        description: error.response?.data?.message || "Active processing streams depend on this tracking node.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-300 text-foreground">
      <div className="flex flex-col gap-1.5 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Case Log Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Audit, compile, and record medical incident cases matching analytical operations across systemic clinics.
        </p>
      </div>

      <CaseFilters 
        searchTerm={searchTerm} 
        onSearchChange={(val) => {
          setPage(0); // Always reset index on filtering criteria changes
          setSearchTerm(val);
        }} 
        onAddClick={handleOpenAddModal} 
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <Loader message="Synchronizing global diagnostic case files..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* 👈 Render data direct from backend stream instead of sub-slicing internally */}
          <CaseTable 
            cases={filteredCases} 
            onViewCase={handleOpenViewModal} 
          />
          
          {totalPages > 1 && (
            <PaginationWrapper
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(targetPage) => setPage(targetPage)}
              isLoading={loading}
            />
          )}
        </div>
      )}

      <CaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCase}
        onDelete={handleTriggerDeletePrompt}
        medicalCase={selectedCase}
        isSubmitting={isSaving}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCaseToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title="Clear Diagnostic Case Tracking Sequence"
        description={`CRITICAL DISPATCH: You are about to permanently purge the case tracking sequence for patient ${caseToDelete?.patientName || "unassigned"}. This operation unlinks history files and active clinical assignments.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}