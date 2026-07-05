import { useMemo } from "react";

export function AdminTable({ logsData, isLoading }) {
  // Helper to map backend actions to semantic Tailwind color schemes
  const getActionBadgeStyles = (action = "") => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("SUCCESS") || act.includes("APPROVED")) {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
    if (act.includes("ROTATED") || act.includes("REFRESH") || act.includes("UPDATE")) {
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
    if (act.includes("LOGOUT") || act.includes("REJECT") || act.includes("DELETE")) {
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden w-full bg-background shadow-xs">
      <div className="w-full overflow-x-auto block scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs table-auto min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider">
              <th className="p-4 pl-5 min-w-[240px]">Performed By</th>
              <th className="p-4 min-w-[200px]">Action</th>
              <th className="p-4 min-w-[280px]">Details</th>
              <th className="p-4 min-w-[140px]">Role</th>
              <th className="p-4 pr-5 text-right min-w-[150px]">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-[11px] text-foreground">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground font-sans text-xs animate-pulse">
                  Loading operational logs from query cache...
                </td>
              </tr>
            ) : !logsData || logsData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground/60 font-sans text-xs italic tracking-wide">
                  Data unavailable
                </td>
              </tr>
            ) : (
              logsData.map((log, index) => {
                const rowKey = log.id || `audit-row-${index}`; 

                return (
                  <tr key={rowKey} className="hover:bg-muted/40 transition-colors">
                    
                    {/* 1. Performed By */}
                    <td className="p-4 pl-5 font-sans text-foreground font-medium text-xs select-all">
                      {log.performedBy || "System Action"}
                    </td>

                    {/* 2. Action Signature Badge */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${getActionBadgeStyles(log.action)}`}>
                        {log.action || "UNKNOWN_ACTION"}
                      </span>
                    </td>

                    {/* 3. Narrative Details Description */}
                    <td className="p-4 font-sans text-muted-foreground leading-relaxed break-words max-w-xs">
                      {log.details || "No operational descriptions logged."}
                    </td>

                    {/* 4. Platform Role */}
                    <td className="p-4 font-sans">
                      {log.role ? (
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                          log.role.includes("ADMIN") 
                            ? "bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wide"
                            : "bg-muted text-muted-foreground border-border uppercase"
                        }`}>
                          {log.role.replace("ROLE_", "")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 font-sans">N/A</span>
                      )}
                    </td>

                    {/* 5. Execution Timestamp */}
                    <td className="p-4 pr-5 text-right text-muted-foreground font-sans whitespace-nowrap">
                      {log.timestamp ? (
                        <>
                          {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} &middot; {" "}
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}