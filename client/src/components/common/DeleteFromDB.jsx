import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProjeto } from '@/features/projetos/projetosSlice';
import { deleteUser, toggleSidebar } from '@/features/utilizadores/utilizadorSlice';
import { AiFillDelete } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { AppButton, ConfirmDialog } from '@/components/ui';

const DeleteFromDB = ({ id, name, isLoading, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
        aria-label={`Eliminar ${type}`}
      />

      <ConfirmDialog
        open={open}
        title={`Eliminar ${type}?`}
        message={`Deseja eliminar o ${type}: ${name}`}
        confirmLabel="Apagar"
        cancelLabel="Cancelar"
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
