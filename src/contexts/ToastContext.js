import React, { createContext, useState, useCallback, useContext } from "react";

/**
 * Toast Context for managing notifications globally
 * Provides methods to show success, error, info, and warning toasts
 */
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // ✅ Define removeToast FIRST
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // ✅ Then addToast
  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  // Convenience methods
  const showSuccess = (message, duration) =>
    addToast(message, "success", duration);

  const showError = (message, duration = 4000) =>
    addToast(message, "error", duration);

  const showInfo = (message, duration) =>
    addToast(message, "info", duration);

  const showWarning = (message, duration) =>
    addToast(message, "warning", duration);

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}