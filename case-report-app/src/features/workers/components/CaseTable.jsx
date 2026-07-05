import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Hash, Calendar, Layers } from "lucide-react";

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
      <div className="w-full overflow-x-auto block scrollbar-thin">
        <table className="w-full text-sm text-left border-collapse table-auto min-w-[900px]">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-xs tracking-wider uppercase transition-colors">
              <th className="p-4 font-semibold min-w-[220px]">Patient </th>
              <th className="p-4 font-semibold min-w-[200px]">Doctor</th>
              <th className="p-4 font-semibold min-w-[150px]">Logged Date</th>
              <th className="p-4 font-semibold text-center w-[110px] min-w-[110px]">Test Count</th>
              <th className="p-4 font-semibold text-right w-[120px] min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground">
            {cases.map((item) => {
              const recordId = item.id || item.caseId;
              
              // Extract the true length of the tests array assigned to this case
              const testCount = Array.isArray(item.tests) ? item.tests.length : 0;

              return (
                <tr key={recordId} className="hover:bg-muted/30 transition-colors group">
                  {/* Patient Info */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium tracking-tight block truncate max-w-[200px]" title={item.patientName}>
                        {item.patientName}
                      </span>         
                    </div>
                  </td>
                  
                  {/* Doctor Info */}
                  <td className="p-4 align-middle">
                    <span className="text-sm font-medium text-foreground/90 block truncate max-w-[180px]" title={item.doctorName}>
                      {item.doctorName || "Unassigned Practitioner"}
                    </span>
                  </td>
                  
                  {/* Date Logged */}
                  <td className="p-4 align-middle text-muted-foreground text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  
                  {/* Number of Tests Count (Array Length) */}
                  <td className="p-4 text-center align-middle">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Layers className="h-3 w-3" /> {testCount}
                    </span>
                  </td>
                  
               
                  
                  {/* Controls */}
                  <td className="p-4 text-right align-middle">
                    <Button 
                      type="button"
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