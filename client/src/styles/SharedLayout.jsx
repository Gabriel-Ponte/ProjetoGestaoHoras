import styled from 'styled-components';

const Wrapper = styled.section`
  /* window-scroll layout: the (non-sticky) Header scrolls away, the Navbar
     sticks to the top, and the sidebar drawer / sticky table header anchor to
     the navbar via the --nav-bottom / --navbar-height CSS variables set in
     SharedLayout.jsx. */
  --navbar-height: 90px; /* fallback until measured */
  --nav-bottom: 150px; /* fallback until measured */

  .dashboard {
    position: relative;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 1.5rem 0 3rem;
  }
  @media (min-width: 992px) {
    .dashboard-page {
      width: 90%;
    }
  }
`;

export default Wrapper;
