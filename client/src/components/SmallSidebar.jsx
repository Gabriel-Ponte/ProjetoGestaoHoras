import Wrapper from '../assets/wrappers/SmallSidebar';
import { FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import NavLinks from './NavLinks';
const SmallSidebar = () => {
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
          <button className='close-btn' onClick={toggle}>
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
