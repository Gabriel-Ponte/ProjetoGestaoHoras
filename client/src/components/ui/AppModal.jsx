import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';

/**
 * AppModal — accessible dialog rendered in a portal. No MUI needed.
 *
 * <AppModal open={open} onClose={close} title="Exportar horas" footer={<…/>}>
 *   … body …
 * </AppModal>
 */
const sizes = { sm: '380px', md: '520px', lg: '720px' };

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  animation: appmodal-fade 0.15s ease;

  @keyframes appmodal-fade {
    from { opacity: 0; }
  }
`;

const Dialog = styled.div`
  width: 100%;
  max-width: ${(p) => sizes[p.$size] || sizes.md};
  max-height: calc(100vh - 2.5rem);
  display: flex;
  flex-direction: column;
  background: var(--white);
  border-radius: 12px;
  box-shadow: var(--shadow-4);
  overflow: hidden;
  animation: appmodal-pop 0.16s ease;

  @keyframes appmodal-pop {
    from { transform: translateY(8px) scale(0.98); opacity: 0; }
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--grey-200);
  }
  .modal-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--grey-900);
  }
  .modal-close {
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    border-radius: var(--borderRadius);
    font-size: 1.4rem;
    line-height: 1;
    color: var(--grey-500);
    cursor: pointer;
    padding: 0.2rem;
    transition: var(--transition);
  }
  .modal-close:hover { background: var(--grey-100); color: var(--grey-800); }
  .modal-body {
    padding: 1.25rem;
    overflow-y: auto;
    color: var(--grey-700);
  }
  .modal-footer {
    padding: 0.85rem 1.25rem;
    border-top: 1px solid var(--grey-200);
    background: var(--grey-50);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

let titleSeq = 0;

const AppModal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
  showClose = true,
}) => {
  const dialogRef = useRef(null);
  const titleId = useRef(`app-modal-title-${(titleSeq += 1)}`);

  useEffect(() => {
    if (!open) return undefined;
    const prevActive = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (closeOnEsc && e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (prevActive instanceof HTMLElement) prevActive.focus();
    };
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  return createPortal(
    <Overlay
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
      }}
    >
      <Dialog
        $size={size}
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId.current : undefined}
      >
        {(title || showClose) && (
          <div className="modal-head">
            {title ? <h2 id={titleId.current} className="modal-title">{title}</h2> : <span />}
            {showClose && (
              <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
                <IoClose />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </Dialog>
    </Overlay>,
    document.body
  );
};

AppModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  showClose: PropTypes.bool,
};

export default AppModal;
