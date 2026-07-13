import Wrapper from '@/styles/SmallSidebar';
import { FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toggleSidebar } from '@/features/utilizadores/utilizadorSlice';
import NavLinks from '@/components/layout/NavLinks';
const SmallSidebar = () => {
  const { t } = useTranslation('layout');
  const { isSidebarOpen } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className='content'>
          <button className='close-btn' onClick={toggle} aria-label={t('sidebar.close')}>
            <FaTimes />
          </button>
          <header>
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
