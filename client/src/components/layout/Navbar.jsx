import Wrapper from '@/styles/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, clearStore } from '@/features/utilizadores/utilizadorSlice';
import { getAllDiasHorasExtra, getAllDiasHorasExtraResponsavel } from '@/features/allDias/allDiasSlice';
import { handleChange } from '@/features/allProjetos/allProjetosSlice';
import { handleChangePagamentos } from '@/features/pagamentos/pagamentosSlice';
import { AppButton } from '@/components/ui';
import {
  ROLE,
  showsGestaoProjetos,
  showsGestaoHoras,
  showsGestaoHorasExtra,
  showsHorasProjetos,
} from '@/utils/roles';

const Navbar = () => {
  const { t } = useTranslation('layout');
  const [showLogout, setShowLogout] = useState(false);
  const [disableAddHoras, setDisableAddHoras] = useState(false);
  const [verificaHorasExtra, setVerificaHorasExtra] = useState(false);
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tipo = user?.user?.tipo;

  useEffect(() => {
    try {
      dispatch(handleChangePagamentos({ name: 'tipo', value: '1' }));

      const markPending = (res) => {
        const arr = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setVerificaHorasExtra(arr.length > 0);
      };

      if (tipo === ROLE.ADMIN_LAB) {
        dispatch(getAllDiasHorasExtraResponsavel()).then(markPending);
      } else if (tipo === ROLE.ADMIN_RH) {
        dispatch(getAllDiasHorasExtra()).then(markPending);
      }
    } catch (error) {
      console.error(error);
    }
  }, [tipo, dispatch]);

  const closeMenus = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
  };

  const toggle = () => {
    closeMenus();
    dispatch(toggleSidebar());
  };

  const handleShowLogoutClick = () => {
    setShowLogout((v) => !v);
    setDisableAddHoras((v) => !v);
  };

  const editarPerfil = () => {
    closeMenus();
    navigate('/PaginaEditarPerfil');
  };

  const logout = () => {
    closeMenus();
    dispatch(clearStore(t('nav.loggingOut')));
    navigate('/login');
  };

  const returnMain = () => {
    closeMenus();
    dispatch(handleChange({ name: 'tipoTrabalho', value: '' }));
    dispatch(toggleSidebar(false));
    navigate('/PaginaPrincipal');
  };

  const navGestaoHorasExtra = () => {
    closeMenus();
    dispatch(handleChange({ name: 'tipoTrabalho', value: '' }));
    dispatch(toggleSidebar(false));
    navigate('/paginaGerirHorasExtra');
  };

  const visualizarHoras = () => {
    closeMenus();
    dispatch(toggleSidebar(false));
    navigate('/PaginaVisualizarHoras');
  };

  const visualizarHorasProjetos = () => {
    closeMenus();
    dispatch(toggleSidebar(false));
    navigate('/PaginaVisualizarHorasProjetos');
  };

  const addHoras = () => {
    closeMenus();
    dispatch(toggleSidebar(false));
    navigate('/PaginaAdicionarHoras');
  };

  const gestaoProjetos = showsGestaoProjetos(tipo);
  const gestaoHoras = showsGestaoHoras(tipo);
  const gestaoHorasExtra = showsGestaoHorasExtra(tipo);
  const fallbackTitle = !gestaoProjetos && !gestaoHoras && !gestaoHorasExtra;

  const fotoUrl = user?.user?.foto
    ? URL.createObjectURL(
        new Blob([new Uint8Array(user.user.foto.data.data)], { type: user.user.foto.contentType })
      )
    : null;

  return (
    <Wrapper>
      <div className='subheader'>
        <div className='nav-left'>
          <button
            type='button'
            className='toggle-btn'
            onClick={toggle}
            aria-label={t('nav.openMenu')}
          >
            <FaAlignLeft />
          </button>
        </div>

        <div className='nav-center'>
          {gestaoProjetos && (
            <AppButton variant='secondary' size='sm' onClick={returnMain}>
              {t('nav.projetosManagement')}
            </AppButton>
          )}
          {gestaoHoras && (
            <AppButton
              variant={verificaHorasExtra ? 'success' : 'secondary'}
              size='sm'
              onClick={navGestaoHorasExtra}
            >
              {t('nav.horasManagement')}
            </AppButton>
          )}
          {gestaoHorasExtra && (
            <AppButton
              variant={verificaHorasExtra ? 'success' : 'secondary'}
              size='sm'
              onClick={navGestaoHorasExtra}
            >
              {t('nav.horasExtraManagement')}
            </AppButton>
          )}
          {fallbackTitle && <h1>{t('nav.appTitle')}</h1>}
        </div>

        <div className='nav-right'>
          <div className='btn-container'>
            <button type='button' className='user-chip' onClick={handleShowLogoutClick}>
              <span className='user-chip-name'>{user?.user?.nome}</span>
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={t('nav.profilePhotoAlt')}
                  width='22'
                  height='22'
                  className='rounded-circle avatar'
                />
              ) : (
                <FaUserCircle size={22} className='avatar-icon' />
              )}
              <FaCaretDown />
            </button>

            {!showLogout ? (
              <div className='quick-actions'>
                <AppButton
                  variant='secondary'
                  size='sm'
                  onClick={addHoras}
                  disabled={disableAddHoras}
                >
                  {t('nav.addHoras')}
                </AppButton>
                <AppButton
                  variant='secondary'
                  size='sm'
                  onClick={visualizarHoras}
                  disabled={disableAddHoras}
                >
                  {t('nav.viewHoras')}
                </AppButton>
                {showsHorasProjetos(tipo) && (
                  <AppButton
                    variant='secondary'
                    size='sm'
                    onClick={visualizarHorasProjetos}
                    disabled={disableAddHoras}
                  >
                    {t('nav.horasProjetos')}
                  </AppButton>
                )}
              </div>
            ) : (
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
      </div>
    </Wrapper>
  );
};
export default Navbar;
