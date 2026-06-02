export function DoctorManagement() {
  const doctors = [
    { name: "Dr. Sarah Jenkins", dept: "Cardiology", shifts: "Day-Shift" },
    { name: "Dr. Michael Vance", dept: "Pediatrics", shifts: "On-Call" }
  ]

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {doctors.map((d) => (
          <div key={d.name} className="p-4 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-1">
            <h4 className="font-semibold text-lg">{d.name}</h4>
            <span className="text-sm text-muted-foreground">Specialty: {d.dept}</span>
            <span className="text-xs font-medium mt-2 px-2 py-1 bg-secondary rounded w-max">{d.shifts}</span>
          </div>
        ))}
      </div>
    </div>
  )
}