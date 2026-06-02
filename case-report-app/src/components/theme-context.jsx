import { createContext } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export { ThemeProviderContext };
