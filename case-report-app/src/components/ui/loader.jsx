import { cn } from "@/lib/utils";

export function Loader({
  message = "Loading...",
  variant = "default", // "default" | "inline" | "fullPage"
  className,
  ...props
}) {
  const isInline = variant === "inline";
  const isFullPage = variant === "fullPage";

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center selection:bg-transparent text-foreground",
        // Standard layout structural conditions
        isInline ? "inline-flex gap-2" : "flex-col gap-3 py-8",
        
        // Full Page absolute layout centering with your native background token matching configuration layers
        isFullPage && [
          "fixed inset-0 z-50 flex-col gap-4 m-0 p-0",
          "w-screen h-screen items-center justify-center",
          "bg-background/95 backdrop-blur-xs text-foreground"
        ],
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block rounded-full animate-spin border-solid",
          isInline 
            ? "h-4 w-4 border-2 border-current border-t-transparent" 
            : "h-10 w-10 border-4 border-muted border-t-primary", // Uses your red accent rotating over the muted path track
          isFullPage && "h-12 w-12 border-4 border-border/40 border-t-primary" // Clean high-fidelity contrast variant
        )}
      />
      {message ? (
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            isInline ? "leading-none" : "tracking-wide text-muted-foreground",
            isFullPage && "text-muted-foreground/90" // Harmonious text matching across themes
          )}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}