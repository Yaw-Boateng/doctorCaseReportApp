import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PasswordInput({
  label,
  id,
  placeholder,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    /* We keep className here on the outer wrapper for general positioning/margins if needed */
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium tracking-wide text-foreground">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          /* Updated to match your premium style rules:
            - h-11 (constant height matching the email input)
            - rounded-xl (smoother corners from your inspiration dashboard image)
            - border-border bg-input (proper theme token layout mapping)
            - px-3.5 pr-12 (aligns left padding with email perfectly while preserving right room for the toggle)
          */
          className="h-11 w-full rounded-xl border border-border bg-input px-3.5 pr-12 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background placeholder:text-muted-foreground"
          {...props}
        />

        {/* Absolute wrapper perfectly centers the toggle button within the h-11 parent */}
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors rounded-lg"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}