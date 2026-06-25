import React, { useState, useEffect, useCallback } from "react";
import caseService from "@/lib/caseService";
import { Loader2 } from "lucide-react";
import { CaseFilters } from "./components/CaseFilters";
import { CaseModal } from "./components/CaseModal";
import { CaseTable } from "./components/CaseTable";

export default function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [page, setPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await caseService.getAllCases({
        page,
        size: 10,
        search: searchTerm || undefined
      });
      
      const nestedData = response?.data;
      if (nestedData && Array.isArray(nestedData.content)) {
        setCases(nestedData.content);
      } else if (Array.isArray(nestedData)) {
        setCases(nestedData);
      } else {
        setCases([]);
      }
    } catch (error) {
      console.error("Failed to sync case matrix tracking lines:", error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCases();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchCases]);

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
      if (selectedCase) {
        await caseService.updateCase(selectedCase.caseId, formData);
      } else {
        await caseService.createCase(formData);
      }
      setIsModalOpen(false);
      fetchCases();
    } catch (error) {
      console.error("Persisting operations mutations failed on target endpoint context:", error);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm("Are you sure you want to permanently clear this diagnostic case tracking sequence?")) {
      try {
        await caseService.deleteCase(caseId);
        fetchCases();
      } catch (error) {
        console.error("Purging transactional log case records context failed execution:", error);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1.5 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Case Log Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Audit, compile, and record medical incident cases matching analytical operations across systemic clinics.
        </p>
      </div>

      <CaseFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onAddClick={handleOpenAddModal} 
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary/80" />
        </div>
      ) : (
        <CaseTable 
          cases={cases}
          onViewCase={handleOpenViewModal} 
        />
      )}

      <CaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCase}
        onDelete={handleDeleteCase}
        medicalCase={selectedCase}
      />
    </div>
  );
}