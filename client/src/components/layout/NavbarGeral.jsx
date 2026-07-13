import Wrapper from '@/styles/NavbarGeral';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clearStore } from '@/features/utilizadores/utilizadorSlice';
import { AppButton } from '@/components/ui';

const Navbar = () => {
  const { t } = useTranslation('layout');
  const [showLogout, setShowLogout] = useState(0);
  const [disableAddHoras, setDisableAddHoras] = useState(0);
  const [disableVisualizardHoras, setDisableVisualizarHoras] = useState(0);
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowLogoutClick = () => {
    setShowLogout(!showLogout);
  };

  const editarPerfil = () => {
    setDisableAddHoras(2);
    setDisableVisualizarHoras(2);
    setShowLogout(false);
    navigate('/PaginaEditarPerfil');
  };

  const logout = () => {
    setShowLogout(false);
    setDisableAddHoras(0);
    dispatch(clearStore(t('nav.loggingOut')));
    navigate('/login');
  };

  const visualizarHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(0);
    setDisableVisualizarHoras(1);
    navigate('/PaginaVisualizarHoras');
  };

  const addHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(1);
    setDisableVisualizarHoras(0);
    navigate('/PaginaAdicionarHoras');
  };

  // "active" highlight mirrors the previous green-background logic exactly:
  // Adicionar Horas is highlighted when it is the active page OR nothing is selected yet.
  const addHorasActive = disableAddHoras === 1 || disableVisualizardHoras === 0;
  const visualizarActive = disableVisualizardHoras === 1;

  const fotoUrl = user?.user?.foto
    ? URL.createObjectURL(
        new Blob([new Uint8Array(user.user.foto.data.data)], { type: user.user.foto.contentType })
      )
    : null;

  return (
    <Wrapper>
      <div className='subheader'>
        <div className='col-1'></div>
        <div className='col-8'>
          <div className='row'>
            <div className='col-6 middleButton'>
              <AppButton
                variant={addHorasActive ? 'primary' : 'secondary'}
                size='sm'
                onClick={addHoras}
                disabled={disableAddHoras === 1}
              >
                {t('nav.addHoras')}
              </AppButton>
            </div>
            <div className='col-6 middleButton'>
              <AppButton
                variant={visualizarActive ? 'primary' : 'secondary'}
                size='sm'
                onClick={visualizarHoras}
                disabled={disableVisualizardHoras === 1}
              >
                {t('nav.viewHoras')}
              </AppButton>
            </div>
          </div>
        </div>
        <div className='col-2'>
          <div className='row btn-container text-center'>
            <div className='col-12 text-center divButtonUtilizador'>
              <button type='button' className='btn' onClick={handleShowLogoutClick}>
                {user?.user?.nome}
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt={t('nav.profilePhotoAlt')}
                    width='20'
                    height='20'
                    className='rounded-circle'
                  />
                ) : (
                  <FaUserCircle size={20} />
                )}
                <FaCaretDown />
              </button>
            </div>
            {showLogout === true && (
              <div className='drop'>
                <AppButton variant='secondary' size='sm' onClick={editarPerfil}>
                  {t('nav.editProfile')}
                </AppButton>
                <AppButton variant='danger' size='sm' onClick={logout}>
                  {t('nav.logout')}
                </AppButton>
              </div>
            )}
          </div>
        </div>
        <div className='col-1'></div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
