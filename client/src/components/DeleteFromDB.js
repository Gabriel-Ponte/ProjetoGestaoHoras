import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProjeto } from '../features/projetos/projetosSlice';
import { deleteUser } from "../features/utilizadores/utilizadorSlice";
import { toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import { AiFillDelete } from 'react-icons/ai';

const DeleteFromDB = ({ id, name, isLoading, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalType, setModalType] = useState('');
  const [setModalId] = useState('');
  const handleClose = () => {
    setShowModal(false);
  };

  const handleModal = (id, name, type) => {
    setModalName(name);
    setModalType(type);
    setModalId(id);
    setShowModal(true);
  };


  const handleConfirmDelete = async () => {
    setShowModal(false);
    try {
      let result;
      if (type === "Projeto") {
        result = await dispatch(deleteProjeto(id));
      } else if (type === "Utilizador") {
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
      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#ModalFoto"
        data-bs-backdrop="static"
        onClick={() => handleModal(id, name, type)}
      >
        {isLoading ? 'loading...' : <AiFillDelete />}
      </button>

      <div
        className={showModal ? 'modal show' : 'modal fade'}
        id="ModalFoto"
        tabIndex="-1"
        aria-labelledby="ModalLabelFoto"
        aria-hidden={!showModal}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content  modal-dialog-centered">
            <p>Deseja eliminar o {modalType}: {modalName}</p>
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleConfirmDelete}
              >
                Apagar
              </button>
              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default DeleteFromDB;