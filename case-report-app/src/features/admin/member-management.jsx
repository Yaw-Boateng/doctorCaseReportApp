export function MemberManagement() {
  const members = [
    { id: "1", name: "Alice Johnson", role: "Manager", status: "Active" },
    { id: "2", name: "Dr. Robert Chen", role: "Doctor", status: "Active" },
    { id: "3", name: "George Kwesi", role: "Admin", status: "Pending" }
  ]

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Manage organizational access rules and parameters.</p>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Access Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-muted/30">
                <td className="p-3 font-medium">{m.name}</td>
                <td className="p-3 text-muted-foreground">{m.role}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${m.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}