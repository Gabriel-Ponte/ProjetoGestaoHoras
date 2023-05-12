import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProjeto } from '../features/projetos/projetosSlice';
import { toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import Wrapper from '../assets/wrappers/ModalFoto';

const DeleteProject = ({ id, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  

  const handleConfirm = () => {
    setShowModal(false);
    handleConfirmDelete();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await dispatch(deleteProjeto(id));
      if (!result.error) {
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaPrincipal');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#ModalFoto"
            onClick={() => setShowModal(true)}
          >
        {isLoading ? 'loading...' : 'Apagar'}
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
            <p>Deseja eliminar o Projeto</p>
            <div className="modal-actions">
              <button   
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleConfirm}>Apagar</button>
              <button 
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={handleClose}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
