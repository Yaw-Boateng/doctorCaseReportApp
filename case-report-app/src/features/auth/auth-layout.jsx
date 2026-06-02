export function AuthLayout({ title, children }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground shadow-2xl shadow-primary/10 dark:shadow-black/40 mx-auto my-12">
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="p-8">
        <div className="flex flex-col gap-1 mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Doctor Case Report Portal Security
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
