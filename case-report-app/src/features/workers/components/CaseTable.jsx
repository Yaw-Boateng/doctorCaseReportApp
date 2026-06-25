import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Hash, Calendar } from "lucide-react";

export const CaseTable = ({ cases, onViewCase }) => {
  if (!cases || cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] rounded-xl border border-dashed p-8 text-center bg-card/30 backdrop-blur-xs">
        <p className="text-sm font-medium text-muted-foreground">
          No tracking record cases found logged inside the context lifecycle.
        </p>
      </div>
    );
  }

  // Helper to format timestamps cleanly
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden text-white/90">
      {/* Container enables clean horizontal scrolling matching your admin panel layout */}
      <div className="w-full overflow-x-auto block scrollbar-thin">
        <table className="w-full text-sm text-left border-collapse table-auto min-w-[850px]">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-xs tracking-wider uppercase transition-colors">
              <th className="p-4 font-semibold min-w-[220px]">Patient Context</th>
              <th className="p-4 font-semibold min-w-[200px]">Attending Doctor</th>
              <th className="p-4 font-semibold min-w-[180px]">Diagnostic Test</th>
              <th className="p-4 font-semibold min-w-[150px]">Logged Date</th>
              <th className="p-4 font-semibold text-center w-[120px] min-w-[120px]">Case Count</th>
              <th className="p-4 font-semibold text-right w-[120px] min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground">
            {cases.map((item) => {
              // Handle case metric identifier safely based on your JSON structure
              const recordId = item.id || item.caseId;

              return (
                <tr key={recordId} className="hover:bg-muted/30 transition-colors group">
                  {/* Patient Name and ID Stack */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium tracking-tight block truncate max-w-[200px]" title={item.patientName}>
                        {item.patientName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]" title={recordId}>
                        ID: {recordId && recordId.length > 8 ? `${recordId.slice(0, 8)}...` : recordId}
                      </span>
                    </div>
                  </td>
                  
                  {/* Doctor Name Column */}
                  <td className="p-4 align-middle">
                    <span className="text-sm font-medium text-foreground/90 block truncate max-w-[180px]" title={item.doctorName}>
                      {item.doctorName || "Unassigned Practitioner"}
                    </span>
                  </td>
                  
                  {/* Diagnostic Test Type Name Column */}
                  <td className="p-4 align-middle">
                    <span className="text-sm text-foreground/80 block truncate max-w-[160px]" title={item.testName}>
                      {item.testName || "General Profile Scan"}
                    </span>
                  </td>

                  {/* Created At Date Log Column */}
                  <td className="p-4 align-middle text-muted-foreground text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  
                  {/* Total Case Number Array Counter Cell */}
                  <td className="p-4 text-center align-middle">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      <Hash className="h-3 w-3" /> {item.numberOfCases !== undefined ? item.numberOfCases : 1}
                    </span>
                  </td>
                  
                  {/* Operational Controls Trigger */}
                  <td className="p-4 text-right align-middle">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewCase(item)}
                      className="gap-1.5 h-8 text-xs font-medium border border-transparent hover:border-border hover:bg-muted text-muted-foreground hover:text-foreground opacity-90 group-hover:opacity-100 transition-all whitespace-nowrap"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Case
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