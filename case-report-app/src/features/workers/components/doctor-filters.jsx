import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import doctorService from "@/lib/doctorService";
import { Plus, Search, Loader2 } from "lucide-react";

export const DoctorFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedSpecialty, 
  onSpecialtyChange, 
  onAddClick 
}) => {
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setLoadingSpecs(true);
        const res = await doctorService.getAllSpecialties();
        if (res?.success && Array.isArray(res.data)) {
          setSpecialties(res.data);
        } else if (Array.isArray(res)) {
          setSpecialties(res);
        } else if (Array.isArray(res?.data?.content)) {
          setSpecialties(res.data.content);
        }
      } catch (error) {
        console.error("Failed loading specialty routing filters:", error);
      } finally {
        setLoadingSpecs(false);
      }
    };
    fetchDropdownOptions();
  }, []);

  return (
    // 🌟 FIXED RESPONSIVENESS: Rewrote parent layout tracking flow properties
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-2 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full max-w-2xl">
        
        {/* Search Input Field Container Layout Element */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors via system route..."
            value={searchTerm}
            disabled={!!selectedSpecialty}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background/50 focus-visible:ring-1 w-full h-9"
          />
        </div>

        {/* Select Dropdown Selector Section Container Wrapper */}
        <div className="relative w-full sm:w-[200px] shrink-0">
          <select
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            disabled={loadingSpecs}
            className="w-full h-9 px-3 pr-8 text-sm rounded-md border border-input bg-background/50 text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer appearance-none disabled:opacity-50"
          >
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
          
          {/* Arrow Indicator Icon Representation Layer */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
          
          {loadingSpecs && (
            <Loader2 className="absolute right-8 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* 🌟 FIXED RESPONSIVENESS: Stretches cleanly on mobile, snaps automatically to content on desktop screen states */}
      <div className="w-full md:w-auto">
        <Button onClick={onAddClick} className="w-full md:w-auto gap-2 tracking-wide text-xs font-medium shadow-xs h-9 justify-center">
          <Plus className="h-4 w-4 shrink-0" /> Register Doctor
        </Button>
      </div>
    </div>
  );
};