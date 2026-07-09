import NavLinks from '@/components/layout/NavLinks';
import Wrapper from '@/styles/BigSidebar';
import { useSelector } from 'react-redux';

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.utilizador);
  return (
    <Wrapper>
      <div
        className={
          !isSidebarOpen
            ? 'sidebar-container '
            : 'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
