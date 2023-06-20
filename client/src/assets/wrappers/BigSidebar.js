import styled from 'styled-components'

const Wrapper = styled.aside`


 
@media (max-width: 991px) {
  position: static;
  top:0;
  z-index: 9988;
  width: 100%;
  height: auto;
    .nav-link {
      display: flex;
      align-items: center;
      color: var(--grey-500);
      padding: 0.3rem 0;
      padding-left: 2rem;
      text-transform: capitalize;
      transition: var(--transition);
      font-size: 3vw;
    }


    .sidebar-container {
      display: inline-block;
      background-color: #303030;
      margin-left: -1000%;
      background: var(--white);
      height: auto;
      width: 100%;
      z-index: 9988;
      transition: var(--transition);
      position: fixed;
      top:0;
      overflow:auto;
    }

    .content {
      height: auto;
      overflow: auto;
      position: static;
      width: 100vw;
      padding-bottom: 1rem;
      top:0;
      background-color: #E5E5E5;
    }
    
    .show-sidebar {
      overflow:auto;
      height: auto;
      width: 100vw;
      margin: 0;
      position: static;
      top:0;
    }
    .nav-links {
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
    }


    .nav-link:hover {
      padding-left: 3rem;
    }
    .nav-link:hover .icon {
      color: #a19fa0;
    }
    .icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      display: grid;
      place-items: center;
      transition: var(--transition);
    }
    .active {
      color: var(--grey-900);
    }
    .active .icon {
      color: var(--primary-500);
    }
  }

  @media (min-width: 992px) {

    .nav-link {
      display: flex;
      position: sticky;
      top: 0;
      left: 0;
      align-items: center;
      color: var(--grey-500);
      padding: 0.6rem 0;
      padding-left: 2rem;
      padding-right: .5rem;
      text-transform: capitalize;
      transition: var(--transition);
      margin: 0;
      font-size: 0.8vw;
  }


  @media {
    .sidebar-container {
      display: inline-block;
      background-color: #303030;
      margin-left: -1000%;
      background: var(--white);
      min-height: 100vh;
      height: auto;
      width: auto;
      min-width:20vw;
      position: fixed;
      z-index: 9988;
      transition: var(--transition);
    }
  }

    .content {
      height: 100vh;
      overflow: auto;
      position: sticky;
      top: 74px;
      
      background-color: #E5E5E5;
    }
    
    .show-sidebar {
      height: 100%;
      margin: 0;
      position: sticky;
      top:0;
    }
   
 
    header {
      height: 6rem;
      display: flex;
      align-items: center;
      padding-left: 2.5rem;
    }
    .nav-links {
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
    }

    .nav-link:hover {
      color: #a19fa0;
    }
    .nav-link:hover .icon {
      color: #a19fa0;
    }
    .icon {
      font-size: 1rem;
      margin-right: 0.5rem;
      display: grid;
      place-items: center;
      transition: var(--transition);
    }
    .active {
      color: var(--grey-900);
    }
    .active .icon {
      color: var(--primary-500);
    }
  }
`
export default Wrapper
