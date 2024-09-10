import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  
  const {user}  = useSelector((store) => store.utilizador);

  const handleClearStoreAndRedirect = async (message) => {
    dispatch(clearStore(message));
  };
  
  useEffect(() => {
    if (user?.user?.tipo === 8) {
      handleClearStoreAndRedirect('Utilizador Inativo!');
    }
  }, [user, dispatch]);

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
