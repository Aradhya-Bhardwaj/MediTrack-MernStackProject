import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

const Toast = ({ message, type = 'info', onClose, id }) => {
    const icons = {
        success: <CheckCircle className="toast-icon text-success" />,
        error: <XCircle className="toast-icon text-danger" />,
        warning: <AlertCircle className="toast-icon text-accent" />,
        info: <Info className="toast-icon text-secondary" />
    };

    return (
        <div className={`toast-item toast-${type} animate-slide-in`}>
            <div className="toast-content">
                {icons[type]}
                <span className="toast-message">{message}</span>
            </div>
            <button onClick={() => onClose(id)} className="toast-close">
                <X size={16} />
            </button>
            <div className="toast-progress"></div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
