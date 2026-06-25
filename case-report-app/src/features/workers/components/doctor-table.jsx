import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const DoctorTable = ({ doctors, onViewProfile }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] rounded-xl border border-dashed p-8 text-center bg-card/30 backdrop-blur-xs">
        <p className="text-sm font-medium text-muted-foreground">No doctors registered matching your system profiles.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden transition-all text-white/90">
      {/* Container enables clean horizontal container overflow panning matching your admin layout */}
      <div className="w-full overflow-x-auto block scrollbar-thin">
        <table className="w-full text-sm text-left border-collapse table-auto min-w-[850px]">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-xs tracking-wider uppercase transition-colors">
              <th className="p-4 font-semibold min-w-[240px]">Doctor Details</th>
              <th className="p-4 font-semibold min-w-[180px]">Hospital</th>
              <th className="p-4 font-semibold min-w-[180px]">Specialty</th>
              <th className="p-4 font-semibold w-[110px] min-w-[110px]">Status</th>
              <th className="p-4 font-semibold text-right w-[120px] min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground">
            {doctors.map((doctor) => {
              const isActive = doctor.status === "ACTIVE";
              const computedName = doctor.fullName.startsWith("Dr.") ? doctor.fullName : `Dr. ${doctor.fullName}`;

              return (
                <tr key={doctor.doctorId} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground tracking-tight block truncate max-w-[220px]" title={computedName}>
                        {computedName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono text-[11px] truncate max-w-[220px]" title={doctor.email}>
                        {doctor.email || "No email profile"}
                      </span>
                      {doctor.phoneNumber && (
                        <span className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">{doctor.phoneNumber}</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                    <span className="text-sm text-foreground/90 font-medium block truncate max-w-[160px]" title={doctor.hospitalName || "N/A"}>
                      {doctor.hospitalName || "N/A"}
                    </span>
                  </td>

                  <td className="p-4 align-middle">
                    <span className="text-sm text-foreground/90 block truncate max-w-[160px]" title={doctor.specialty || doctor.specialtyName || "General Medicine"}>
                      {doctor.specialty || doctor.specialtyName || "General Medicine"}
                    </span>
                  </td>

                  <td className="p-4 align-middle">
                    <Badge 
                      variant={isActive ? "success" : "secondary"}
                      className="text-[11px] px-2 py-0.5 rounded-md font-medium tracking-wide uppercase"
                    >
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-4 text-right align-middle">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewProfile(doctor)}
                      className="gap-1.5 h-8 text-xs font-medium border border-transparent hover:border-border hover:bg-muted text-muted-foreground hover:text-foreground opacity-90 group-hover:opacity-100 transition-all whitespace-nowrap"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Profile
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};