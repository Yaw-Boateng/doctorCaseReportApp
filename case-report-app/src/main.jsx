// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./features/auth/context/auth-context"; // Adjust your path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css"; // Your styles
import { ToastProvider } from "./components/ToastContext.jsx";

// Initialize the global Query Client instance
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* 👈 2. Wrap the ToastProvider right here inside AuthProvider */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);