import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('auth');

  const { user } = useSelector((store) => store.utilizador);

  const handleClearStoreAndRedirect = async (message) => {
    dispatch(clearStore(message));
  };

  useEffect(() => {
    if (user?.user?.tipo === 8) {
      handleClearStoreAndRedirect(t('guard.inactiveUser'));
    }
  }, [user, dispatch, t]);

  // If user exists and is active (tipo !== 8), render the children
  if (!user) {
    return <Navigate to='/login' />;
  } else if (user?.user?.tipo === 8) {
    return <Navigate to='/login' />;
  } else if (user && user.user.tipo !== 8) {
    return <>{children}</>;
  }

  return null; // Return null in case none of the conditions match
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
