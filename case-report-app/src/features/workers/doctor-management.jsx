import React, { useState, useEffect, useCallback } from "react";
import doctorService from "@/lib/doctorService";
import { DoctorFilters } from "./components/doctor-filters";
import { DoctorTable } from "./components/doctor-table";
import { DoctorModal } from "./components/doctor-modal";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { Loader } from "@/components/ui/loader";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { useToast } from "@/components/ToastContext"; // 👈 1. Import toast context hook

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const { addToast } = useToast(); // 👈 2. Initialize addToast hook

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      const config = {
        page,
        size: 10,
        search: searchTerm || undefined,
      };

      if (selectedSpecialty) {
        response = await doctorService.getDoctorsBySpecialty(
          selectedSpecialty,
          config,
        );
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
      
      // 👈 3. Registry fetch error feedback
      addToast({
        type: "error",
        title: "Database Sync Error",
        description: "Failed to load the active clinician infrastructure registries.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedSpecialty, addToast]);

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
        
        // 👈 4. Record update modification success toast
        addToast({
          type: "success",
          title: "Profile Synchronized",
          description: `Successfully applied core record modifications for Dr. ${formData.lastName || ""}.`,
          duration: 4000
        });
      } else {
        await doctorService.registerDoctor(formData);
        
        // 👈 5. Profile creation registration success toast
        addToast({
          type: "success",
          title: "Practitioner Provisioned",
          description: `Dr. ${formData.firstName || ""} ${formData.lastName || ""} has been added to system registries.`,
          duration: 4500
        });
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (error) {
      console.error("Failed persisting mutation context profiles:", error);
      
      // 👈 6. Error handling for broken persistent payload inputs
      addToast({
        type: "error",
        title: "Registration Faulted",
        description: error.response?.data?.message || "Validation failure processing profile metadata fields.",
        duration: 5000
      });
    }
  };

  const handleTriggerDeletePrompt = (id) => {
    const targetDoctor =
      doctors.find((doc) => doc.doctorId === id) || selectedDoctor;
    if (!targetDoctor) return;

    setDoctorToDelete(targetDoctor);
    setIsDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!doctorToDelete) return;
    setIsSubmitting(true);
    try {
      await doctorService.deleteDoctor(doctorToDelete.doctorId);
      
      // 👈 7. Core structural index wipe toast (destructive action accenting)
      addToast({
        type: "error",
        title: "Registry Entry Purged",
        description: `Successfully wiped all platform metadata nodes associated with ${doctorToDelete.fullName || "this practitioner"}.`,
        duration: 4500
      });

      setIsDeleteModalOpen(false);
      if (selectedDoctor?.doctorId === doctorToDelete.doctorId) {
        setIsModalOpen(false);
      }
      setDoctorToDelete(null);
      fetchDoctors();
    } catch (error) {
      console.error("Purging state records failed context execution:", error);
      
      // 👈 8. Deletion constraint failure warning toast
      addToast({
        type: "error",
        title: "Purge Command Blocked",
        description: error.response?.data?.message || "Cannot drop parameters linked with active appointment queues.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
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

      // 👈 9. Operational status lifecycle mapping feedback shift
      addToast({
        type: isActive ? "warning" : "success",
        title: isActive ? "Practitioner Suspended" : "Practitioner Activated",
        description: `Dr. ${doctor.lastName || "Practitioner"} operational state flag swapped to ${isActive ? "Inactive" : "Active"}.`,
        duration: 4000
      });

      const updatedRes = await doctorService.getDoctorById(doctor.doctorId);
      if (updatedRes?.data) {
        setSelectedDoctor(updatedRes.data);
      }
      fetchDoctors();
    } catch (error) {
      console.error("Status state patch sync operation fault:", error);
      addToast({
        type: "error",
        title: "State Switch Refused",
        description: "Failed to modify configuration flags on platform runtime nodes.",
        duration: 4000
      });
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-300 text-foreground">
      <div className="flex flex-col gap-1.5 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Doctor Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Provision, verify, and filter medical practitioner profiles within your organization's environment.
        </p>
      </div>

      <DoctorFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setPage(0);
          setSearchTerm(val);
        }}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={(val) => {
          setPage(0);
          setSelectedSpecialty(val);
        }}
        onAddClick={handleOpenAddModal}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <Loader message="Synchronizing registered clinical profiles..." />
        </div>
      ) : (
        <div className="space-y-4">
          <DoctorTable doctors={doctors} onViewProfile={handleOpenViewModal} />

          <PaginationWrapper
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(targetPage) => setPage(targetPage)}
            isLoading={loading}
          />
        </div>
      )}

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoctor}
        onDelete={handleTriggerDeletePrompt}
        onToggleStatus={handleToggleStatus}
        doctor={selectedDoctor}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDoctorToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title="Clear Metadata Profile Record"
        description={`CRITICAL DISPATCH: You are about to permanently purge the clinical registry data for ${doctorToDelete?.fullName || "this practitioner"}. This action destroys scheduling configurations and active session links.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}