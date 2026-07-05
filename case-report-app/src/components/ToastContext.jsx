import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './ui/toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, type = 'info', duration = 5000, actionLabel, onAction }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration, actionLabel, onAction }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Top-Right Stack Wrapper Layer */}
      <div 
        className="fixed top-0 right-0 z-[100] flex flex-col p-4 md:p-6 space-y-3 w-full max-w-[400px] pointer-events-none items-end"
        style={{ direction: 'ltr' }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};