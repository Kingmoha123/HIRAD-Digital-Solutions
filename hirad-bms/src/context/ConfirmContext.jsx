import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Trash2, LogOut, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '../components/ui';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger', // 'danger' | 'warning' | 'info'
    icon: null,
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    icon = null,
  } = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        icon,
      });
    });
  }, []);

  const handleConfirm = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && dialog.isOpen) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog.isOpen]);

  const renderIcon = () => {
    if (dialog.icon) {
      const CustomIcon = dialog.icon;
      return <CustomIcon className="w-8 h-8" />;
    }

    if (dialog.variant === 'warning') {
      return <LogOut className="w-8 h-8 text-amber-500" />;
    }

    if (dialog.variant === 'info') {
      return <Info className="w-8 h-8 text-electric" />;
    }

    // Default 'danger' (Delete)
    return <Trash2 className="w-8 h-8 text-red-500 animate-pulse" />;
  };

  const getIconStyles = () => {
    if (dialog.variant === 'warning') {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/15';
    }
    if (dialog.variant === 'info') {
      return 'bg-blue-500/10 text-electric border-blue-500/20 shadow-blue-500/15';
    }
    return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/15';
  };

  const getConfirmButtonClass = () => {
    if (dialog.variant === 'warning') {
      return 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25';
    }
    if (dialog.variant === 'info') {
      return 'bg-electric hover:bg-blue-600 text-white shadow-lg shadow-electric/25';
    }
    return 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25';
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Modern Centered Confirmation Modal */}
      {dialog.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-md bms-card p-6 md:p-8 rounded-2xl shadow-modal text-center border border-border dark:border-navy-border relative overflow-hidden animate-slide-up bg-white dark:bg-navy-light"
            onClick={e => e.stopPropagation()}
          >
            {/* Close 'X' button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary dark:hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Aura */}
            <div
              className={`w-16 h-16 rounded-2xl border shadow-lg flex items-center justify-center mx-auto mb-4 ${getIconStyles()}`}
            >
              {renderIcon()}
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-bold font-sora text-text-primary dark:text-white mb-2">
              {dialog.title}
            </h3>
            <p className="text-sm text-text-muted dark:text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
              {dialog.message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 justify-center py-2.5 font-medium"
                onClick={handleCancel}
              >
                {dialog.cancelText}
              </Button>
              <button
                type="button"
                className={`flex-1 justify-center py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${getConfirmButtonClass()}`}
                onClick={handleConfirm}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
