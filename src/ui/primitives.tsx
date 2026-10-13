import { useEffect, useId, useRef, type ButtonHTMLAttributes, type PropsWithChildren, type ReactNode } from 'react';

export function Container({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`}>{children}</section>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet';
};
export function Button({ variant = 'secondary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`button button--${variant} ${className}`} {...props} />;
}

export function Dialog({
  open, title, onClose, children, actions, variant = 'modal', closeDisabled = false,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void; actions?: ReactNode; variant?: 'modal' | 'drawer'; closeDisabled?: boolean }>) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
      if (open && previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  useEffect(() => {
    if (open) {
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [open, title]);
  return <dialog ref={ref} className={'dialog' + (variant === 'drawer' ? ' dialog--drawer' : '')} aria-labelledby={titleId} onClose={() => { if (!ref.current?.open) onClose(); }}
    onClick={event => {
      if (variant !== 'drawer' || event.target !== ref.current) return;
      const box = ref.current.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
    }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const dialog = ref.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'))
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) { event.preventDefault(); headingRef.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }}>
    <div className="dialog__header">
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>{title}</h2>
      <Button variant="quiet" disabled={closeDisabled} onClick={onClose} aria-label="Close dialog">Close</Button>
    </div>
    <div className="dialog__body" ref={bodyRef}>{children}</div>
    {actions && <div className="dialog__actions">{actions}</div>}
  </dialog>;
}
