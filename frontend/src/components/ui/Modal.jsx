import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/cn';

import { Button } from './Button';

/**
 * Accessible dialog built on the native <dialog> element, so focus trapping and
 * Esc-to-close come from the platform rather than hand-rolled key handlers.
 * On phones it docks to the bottom of the screen like a sheet.
 */
export function Modal({ open, onClose, title, description, children, footer, className }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event) {
      event.preventDefault();
      onClose();
    }
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className={cn(
        'border-line bg-surface text-fg fixed border shadow-2xl',
        // Phone: full-width sheet pinned to the bottom.
        'inset-x-0 top-auto bottom-0 m-0 max-h-[88vh] w-full rounded-t-2xl rounded-b-none p-0',
        // Tablet and up: centred dialog.
        'sm:rounded-card sm:inset-0 sm:m-auto sm:w-[calc(100vw-3rem)] sm:max-w-lg',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        className
      )}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className="border-line bg-surface sticky top-0 flex items-start justify-between gap-4 border-b px-5 py-4">
        <div className="min-w-0">
          <h2 id="modal-title" className="text-fg text-base font-semibold">
            {title}
          </h2>
          {description && <p className="text-muted mt-0.5 text-sm">{description}</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X size={18} />
        </Button>
      </div>

      <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>

      {footer && (
        <div className="border-line bg-surface pb-safe sticky bottom-0 flex items-center justify-end gap-2 border-t px-5 py-4">
          {footer}
        </div>
      )}
    </dialog>,
    document.body
  );
}

/** Replaces window.confirm() for destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="sm:max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-muted text-sm">{message}</p>
    </Modal>
  );
}
