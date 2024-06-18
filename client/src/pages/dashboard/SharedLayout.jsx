import { Outlet } from 'react-router-dom';
import { Header, BigSidebar, Navbar, SmallSidebar, NavbarGeral } from '../../components';
import { useSelector } from 'react-redux';
import Wrapper from '../../assets/wrappers/SharedLayout';

const SharedLayout = () => {
  const { user } = useSelector((store) => store.utilizador);

  if(user.user.tipo === 3 || user.user.tipo === 4){
    return (
      <Wrapper>
      <Header />
      <NavbarGeral/>
        <main className='dashboard'>
        <BigSidebar/>
          <div>
            <div className='dashboard-page'>
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    );
  }else{

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
  }
};
export default SharedLayout;
