import styled from 'styled-components';

const Wrapper = styled.nav`
  position: sticky;
  top: 0;
  z-index: 998;
  background: var(--white);
  border-bottom: 1px solid var(--grey-200);
  box-shadow: var(--shadow-1);

  .subheader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    min-height: 68px;
    padding: 0.6rem 1.25rem;
  }

  .nav-left {
    flex-shrink: 0;
    padding-top: 0.25rem;
  }
  .nav-center {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.25rem;
  }
  .nav-center h1 {
    margin: 0;
    color: var(--primary-700);
    font-size: 1.35rem;
    font-weight: 700;
    text-transform: none;
  }
  .nav-right {
    flex-shrink: 0;
  }

  /* sidebar toggle */
  .toggle-btn {
    background: transparent;
    border: none;
    font-size: 1.4rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.4rem;
    border-radius: var(--borderRadius);
    transition: var(--transition);
  }
  .toggle-btn:hover {
    background: var(--primary-50);
    color: var(--primary-700);
  }

  /* user chip + its menu */
  .btn-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.45rem;
  }

  .user-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    max-width: 220px;
    background: var(--grey-50);
    border: 1px solid var(--grey-200);
    border-radius: 999px;
    padding: 0.3rem 0.6rem 0.3rem 0.85rem;
    color: var(--grey-800);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  .user-chip:hover {
    background: var(--primary-50);
    border-color: var(--primary-200);
    color: var(--primary-700);
  }
  .user-chip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-chip .avatar {
    object-fit: cover;
    border-radius: 50%;
    background: var(--grey-300);
    flex-shrink: 0;
  }
  .user-chip .avatar-icon {
    color: var(--grey-400);
    flex-shrink: 0;
  }

  .quick-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  /* profile / logout floating menu */
  .drop {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    display: flex;
    gap: 0.4rem;
    padding: 0.4rem;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-3);
    z-index: 999;
  }

  @media (max-width: 600px) {
    .nav-center h1 {
      font-size: 1.1rem;
    }
    .user-chip {
      max-width: 150px;
    }
  }
`;

export default Wrapper;
