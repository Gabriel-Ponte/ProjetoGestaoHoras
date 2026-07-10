import styled from 'styled-components';

const Wrapper = styled.aside`
  /* dim backdrop behind the drawer (click to close).
     starts at the navbar's bottom edge so the navbar stays visible/usable */
  .backdrop {
    position: fixed;
    top: var(--nav-bottom, 150px);
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 990;
  }
  .backdrop.show {
    opacity: 1;
    pointer-events: auto;
  }

  /* off-canvas drawer: hidden by default, slides in when open.
     anchored just below the navbar (tracks it as the header scrolls away) */
  .sidebar-container {
    position: fixed;
    top: var(--nav-bottom, 150px);
    left: 0;
    bottom: 0;
    width: 265px;
    max-width: 85vw;
    display: flex;
    flex-direction: column;
    background: var(--white);
    box-shadow: var(--shadow-4);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 995; /* below the navbar (998) so it never covers it */
    overflow-y: auto;
  }
  .show-sidebar {
    transform: translateX(0);
  }

  .close-btn {
    align-self: flex-end;
    background: transparent;
    border: none;
    font-size: 1.35rem;
    line-height: 1;
    color: var(--grey-400);
    cursor: pointer;
    padding: 0.9rem 1rem 0.25rem;
    transition: var(--transition);
  }
  .close-btn:hover {
    color: var(--red-dark);
  }

  .content {
    padding: 0.25rem 0 2rem;
  }

  /* nav links */
  .nav-links {
    display: flex;
    flex-direction: column;
  }
  /* some links are wrapped in <button> — make those transparent */
  .nav-links button {
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
    text-align: left;
    cursor: pointer;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--grey-600);
    padding: 0.7rem 1.5rem;
    font-weight: 500;
    text-transform: capitalize;
    border-left: 3px solid transparent;
    transition: var(--transition);
  }
  .nav-link:hover {
    color: var(--primary-700);
    background: var(--primary-50);
  }
  .nav-link:hover .icon {
    color: var(--primary-500);
  }

  .icon {
    font-size: 1.15rem;
    display: grid;
    place-items: center;
    color: var(--grey-400);
    transition: var(--transition);
  }

  .active {
    color: var(--primary-700);
    background: var(--primary-50);
    border-left-color: var(--primary-500);
    font-weight: 600;
  }
  .active .icon {
    color: var(--primary-500);
  }

  /* projects sub-list (override the component's inline margin/align) */
  .projetos {
    display: flex;
    flex-direction: column;
    max-height: 32vh;
    overflow-y: auto;
    margin-left: 0 !important;
    padding: 0.25rem 0 0.5rem;
    text-align: left !important;
  }
  .projetos .nav-link {
    padding: 0.45rem 1.5rem 0.45rem 2.5rem;
    font-size: 0.9rem;
    text-transform: none;
    color: var(--grey-500);
  }
`;

export default Wrapper;
