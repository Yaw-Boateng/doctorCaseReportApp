export default function DoctorManagement() {
  const doctors = [
    { name: "Dr. Sarah Jenkins", dept: "Cardiology", shifts: "Day-Shift" },
    { name: "Dr. Michael Vance", dept: "Pediatrics", shifts: "On-Call" },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <div
            key={d.name}
            className="p-4 sm:p-6 border border-border bg-card rounded-lg shadow-sm flex flex-col gap-2"
          >
            <h4 className="font-semibold text-base sm:text-lg">{d.name}</h4>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Specialty: {d.dept}
            </span>
            <span className="text-xs font-medium mt-2 px-3 py-1.5 bg-secondary rounded w-max text-secondary-foreground">
              {d.shifts}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
