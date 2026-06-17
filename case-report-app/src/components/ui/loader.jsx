import { cn } from "@/lib/utils";

export function Loader({
  message = "Loading...",
  variant = "default",
  className,
  ...props
}) {
  const isInline = variant === "inline";
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center",
        isInline ? "inline-flex gap-2" : "flex-col gap-3 py-8",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block rounded-full animate-spin border-primary/20 border-t-primary",
          isInline ? "h-4 w-4 border-2" : "h-10 w-10 border-4",
        )}
      />
      {message ? (
        <span
          className={cn(
            "text-sm text-muted-foreground",
            isInline ? "leading-none" : "",
          )}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}
