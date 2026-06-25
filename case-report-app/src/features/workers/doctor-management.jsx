import React, { useState, useEffect, useCallback } from "react";
import doctorService from "@/lib/doctorService";
import { DoctorFilters } from "./components/doctor-filters";
import { DoctorTable } from "./components/doctor-table";
import { DoctorModal } from "./components/doctor-modal";
import { Loader2 } from "lucide-react";

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(""); // Track selected specialty filter
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Dynamic conditional fetch controller route switching
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      const config = {
        page,
        size: 10,
        search: searchTerm || undefined
      };

      // Switch endpoints seamlessly based on active filter state
      if (selectedSpecialty) {
        response = await doctorService.getDoctorsBySpecialty(selectedSpecialty, config);
      } else if (searchTerm) {
        response = await doctorService.searchDoctors(config);
      } else {
        response = await doctorService.getAllDoctors(config);
      }
      
      const nestedData = response?.data; 
      
      if (nestedData && Array.isArray(nestedData.content)) {
        setDoctors(nestedData.content);
        setTotalPages(nestedData.totalPages || 1);
      } else if (Array.isArray(nestedData)) {
        setDoctors(nestedData);
        setTotalPages(1);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Failed to sync records context lifecycle:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedSpecialty]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchDoctors]);

  const handleOpenAddModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSaveDoctor = async (formData) => {
    try {
      if (selectedDoctor) {
        await doctorService.updateDoctor(selectedDoctor.doctorId, formData);
      } else {
        await doctorService.registerDoctor(formData);
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (error) {
      console.error("Failed persisting mutation context profiles:", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to completely clear out this doctor metadata profile?")) {
      try {
        await doctorService.deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        console.error("Purging state records failed context execution:", error);
      }
    }
  };

  const handleToggleStatus = async (doctor) => {
    try {
      const isActive = doctor.status === "ACTIVE";
      if (isActive) {
        await doctorService.deactivateDoctor(doctor.doctorId);
      } else {
        await doctorService.activateDoctor(doctor.doctorId);
      }
      
      const updatedRes = await doctorService.getDoctorById(doctor.doctorId);
      if (updatedRes?.data) {
        setSelectedDoctor(updatedRes.data);
      }
      fetchDoctors();
    } catch (error) {
      console.error("Status state patch sync operation fault:", error);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1.5 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Management</h1>
        <p className="text-sm text-muted-foreground">
          Provision, verify, and filter medical practitioner profiles within your organization's environment.
        </p>
      </div>

      <DoctorFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={(val) => {
          setPage(0); // Reset page index on category filter updates
          setSelectedSpecialty(val);
        }}
        onAddClick={handleOpenAddModal} 
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary/80" />
        </div>
      ) : (
        <DoctorTable 
          doctors={doctors}
          onViewProfile={handleOpenViewModal} 
        />
      )}

      <DoctorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoctor}
        onDelete={handleDeleteDoctor}
        onToggleStatus={handleToggleStatus}
        doctor={selectedDoctor}
      />
    </div>
  );
}