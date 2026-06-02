import { Button } from "@/components/ui/button"

export function LogCaseManagement() {
  const cases = [
    { trackingId: "CASE-9021", patient: "Anonymous A", intensity: "Urgent", date: "2026-06-01" },
    { trackingId: "CASE-4412", patient: "Anonymous B", intensity: "Routine", date: "2026-05-30" }
  ]

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Case Log Entries</h3>
        <Button size="sm">+ Log New Case</Button>
      </div>
      <div className="flex flex-col gap-2">
        {cases.map((c) => (
          <div key={c.trackingId} className="p-4 border border-border bg-card rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold">{c.trackingId}</div>
              <div className="text-xs text-muted-foreground">Logged on: {c.date}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded font-semibold ${c.intensity === 'Urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
              {c.intensity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}