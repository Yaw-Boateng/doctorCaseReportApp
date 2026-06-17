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
    <div className={`relative flex flex-col gap-2 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="h-10 sm:h-11 w-full rounded-lg border border-input bg-input px-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          {...props}
        />

        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
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
