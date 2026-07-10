import PropTypes from 'prop-types';
import AppModal from './AppModal';
import AppButton from './AppButton';

/**
 * ConfirmDialog — a yes/no confirmation built on AppModal.
 *
 * <ConfirmDialog
 *   open={open}
 *   title="Apagar projeto?"
 *   message="Esta ação não pode ser revertida."
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 * />
 */
const ConfirmDialog = ({
  open,
  title = 'Confirmar',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <AppModal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      closeOnEsc={!loading}
      footer={
        <>
          <AppButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AppButton>
          <AppButton variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </AppButton>
        </>
      }
    >
      {message && <p style={{ margin: 0 }}>{message}</p>}
      {children}
    </AppModal>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  message: PropTypes.node,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'danger', 'success']),
  loading: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.node,
};

export default ConfirmDialog;
