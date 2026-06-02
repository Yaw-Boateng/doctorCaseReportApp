import { Button } from "@/components/ui/button"

export function AdminDashboard() {
  const stats = [
    { label: "Total Members", count: "1,240", change: "+12% standard" },
    { label: "Active Nodes", count: "84", change: "Optimal performance" },
    { label: "System Logs", count: "45,201", change: "0 critical errors" }
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-border bg-card text-card-foreground">
            <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
            <div className="text-3xl font-bold mt-1">{s.count}</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{s.change}</span>
          </div>
        ))}
      </div>
      
      <div className="border border-border rounded-xl p-4 bg-card">
        <h3 className="font-semibold mb-2">Core System Actions</h3>
        <div className="flex gap-2">
          <Button size="sm">Backup Database</Button>
          <Button size="sm" variant="outline">Clear Cache Memory</Button>
        </div>
      </div>
    </div>
  )
}