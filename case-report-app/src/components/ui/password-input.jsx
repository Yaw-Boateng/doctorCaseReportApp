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
    <div className={`relative flex flex-col gap-1 ${className}`}>
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
          className="h-11 w-full rounded-xl border border-input bg-input px-3 pr-14 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          {...props}
        />

        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9 p-0 rounded-full text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20"
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
