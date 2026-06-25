// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./features/auth/context/auth-context"; // Adjust your path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css"; // Your styles

// 1. Initialize the global Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Don't loop endlessly on 401/403 errors
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Provide the QueryClient to the whole application tree */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);