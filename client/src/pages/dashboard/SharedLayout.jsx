import { Outlet } from 'react-router-dom';
import { Header, BigSidebar, Navbar, SmallSidebar, NavbarGeral } from '../../components';
import { useSelector } from 'react-redux';
import { useLayoutEffect, useRef } from 'react';
import Wrapper from '@/styles/SharedLayout';
import { usesNavbarGeral } from '@/utils/roles';

const SharedLayout = () => {
  const { user } = useSelector((store) => store.utilizador);
  const layoutRef = useRef(null);
  const tipo = user.user.tipo;
  const isGeral = usesNavbarGeral(tipo);

  // Expose the navbar's live geometry as CSS variables so the sidebar drawer
  // and the sticky table header sit right below it — even as the (non-sticky)
  // header scrolls away and the navbar sticks to the top.
  useLayoutEffect(() => {
    const root = layoutRef.current;
    if (!root) return;
    const nav = root.querySelector('nav');
    if (!nav) return;

    const update = () => {
      root.style.setProperty('--navbar-height', `${nav.offsetHeight}px`);
      root.style.setProperty(
        '--nav-bottom',
        `${Math.max(0, Math.round(nav.getBoundingClientRect().bottom))}px`
      );
    };
    update();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(nav);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [isGeral]);

  return (
    <Wrapper ref={layoutRef}>
      <Header />
      {isGeral ? <NavbarGeral /> : <Navbar />}
      <main className='dashboard'>
        {!isGeral && <SmallSidebar />}
        <BigSidebar />
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
