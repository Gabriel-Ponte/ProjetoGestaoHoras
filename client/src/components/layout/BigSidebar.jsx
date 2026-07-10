import NavLinks from '@/components/layout/NavLinks';
import Wrapper from '@/styles/BigSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '@/features/utilizadores/utilizadorSlice';
import { FaTimes } from 'react-icons/fa';

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const close = () => dispatch(toggleSidebar(false));

  return (
    <Wrapper>
      <div
        className={isSidebarOpen ? 'backdrop show' : 'backdrop'}
        onClick={close}
      />
      <div
        className={
          isSidebarOpen ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <button
          type='button'
          className='close-btn'
          onClick={close}
          aria-label='Fechar menu'
        >
          <FaTimes />
        </button>
        <div className='content'>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
