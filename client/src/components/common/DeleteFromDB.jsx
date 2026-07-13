import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProjeto } from '@/features/projetos/projetosSlice';
import { deleteUser, toggleSidebar } from '@/features/utilizadores/utilizadorSlice';
import { AiFillDelete } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AppButton, ConfirmDialog } from '@/components/ui';

const DeleteFromDB = ({ id, name, isLoading, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  // `type` is the raw entity key from the caller ("Projeto" | "Utilizador").
  const entity = t(`entities.${type}`, { defaultValue: type });

  const handleConfirmDelete = async () => {
    setOpen(false);
    try {
      let result;
      if (type === 'Projeto') {
        result = await dispatch(deleteProjeto(id));
      } else if (type === 'Utilizador') {
        result = await dispatch(deleteUser(id));
      }
      if (!result.error) {
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaPrincipal');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AppButton
        variant="danger"
        leftIcon={<AiFillDelete />}
        loading={isLoading}
        onClick={() => setOpen(true)}
        aria-label={t('delete.aria', { type: entity })}
      />

      <ConfirmDialog
        open={open}
        title={t('delete.title', { type: entity })}
        message={t('delete.message', { type: entity, name })}
        confirmLabel={t('actions.delete')}
        cancelLabel={t('actions.cancel')}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

DeleteFromDB.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteFromDB;
