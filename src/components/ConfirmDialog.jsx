import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  const AlertIcon = getIcon('AlertTriangle');
  const confirmButtonRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when dialog opens
      confirmButtonRef.current?.focus();
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <motion.div 
          className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md p-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start mb-4">
            <div className="mr-3 text-amber-500 dark:text-amber-400"><AlertIcon size={24} /></div>
            <div>
              <h2 id="dialog-title" className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-surface-600 dark:text-surface-400">{message}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              className="btn btn-outline"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button 
              ref={confirmButtonRef}
              className={`btn ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById('confirm-root')
  );
};

export default ConfirmDialog;