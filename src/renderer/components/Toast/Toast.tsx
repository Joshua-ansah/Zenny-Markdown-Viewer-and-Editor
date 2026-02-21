import { useToast, ToastType } from '../../contexts/ToastContext';
import styles from './Toast.module.css';

export function ToastContainer() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => hideToast(toast.id)}
        >
          <span className={styles.icon}>{getIcon(toast.type)}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              hideToast(toast.id);
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function getIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'warning':
      return '⚠';
    case 'error':
      return '✕';
    default:
      return 'ℹ';
  }
}
