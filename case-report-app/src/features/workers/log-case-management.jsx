import { Button } from "@/components/ui/button";

export default function LogCaseManagement() {
  const cases = [
    {
      trackingId: "CASE-9021",
      patient: "Anonymous A",
      intensity: "Urgent",
      date: "2026-06-01",
    },
    {
      trackingId: "CASE-4412",
      patient: "Anonymous B",
      intensity: "Routine",
      date: "2026-05-30",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-semibold text-base sm:text-lg">Case Log Entries</h3>
        <Button size="sm" className="w-full sm:w-auto">
          + Log New Case
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {cases.map((c) => (
          <div
            key={c.trackingId}
            className="p-4 sm:p-6 border border-border bg-card rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-bold text-sm sm:text-base">
                {c.trackingId}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Logged on: {c.date}
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1.5 rounded font-semibold w-fit ${c.intensity === "Urgent" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"}`}
            >
              {c.intensity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
