import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info } from "lucide-react";
import type { ToastContextType } from "@/types";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type };
    
    setToasts(current => [...current, toast]);
    
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(current => current.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info
  };
  
  const colors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500"
  };
  
  const Icon = icons[toast.type];

  return (
    <div 
      className={cn(
        "backdrop-blur-lg bg-white/25 dark:bg-black/20 border border-white/18 dark:border-white/10 rounded-lg p-4 shadow-lg",
        "transform transition-all duration-300 animate-in slide-in-from-right"
      )}
      onClick={onRemove}
    >
      <div className="flex items-center space-x-3">
        <Icon className={cn("w-5 h-5", colors[toast.type])} />
        <span className="text-gray-900 dark:text-white font-medium">
          {toast.message}
        </span>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
