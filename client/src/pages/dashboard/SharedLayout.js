import { Outlet } from 'react-router-dom';
import { Header, BigSidebar, Navbar, SmallSidebar } from '../../components';
import Wrapper from '../../assets/wrappers/SharedLayout';

const SharedLayout = () => {
  return (
    <Wrapper>
    <Header />
    <Navbar />
      <main className='dashboard'>
      <SmallSidebar/>
      <BigSidebar/>
        <div>
          <div className='dashboard-page'>
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
export default SharedLayout;
