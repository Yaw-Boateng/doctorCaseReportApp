// src/components/theme-toggle.jsx
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle Interface Theme"
    >
      {theme === "dark" ? (
        <span className="text-lg">☀️</span>
      ) : (
        <span className="text-lg">🌙</span>
      )}
    </Button>
  );
}
