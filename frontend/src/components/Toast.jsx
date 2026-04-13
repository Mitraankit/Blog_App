import { createContext, useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'error') => {
    const key = ++id;
    setToasts((prev) => [...prev, { key, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.key !== key)), 4000);
  }, []);

  const dismiss = (key) => setToasts((prev) => prev.filter((t) => t.key !== key));

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className='fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4'>
        {toasts.map(({ key, message, type }) => (
          <div
            key={key}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm text-white animate-fade-in ${
              type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-indigo-500'
            }`}
          >
            <span className='flex-1'>{message}</span>
            <button onClick={() => dismiss(key)} className='opacity-70 hover:opacity-100 leading-none'>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = { children: PropTypes.node.isRequired };

export function useToast() {
  return useContext(ToastContext);
}
