import styled from 'styled-components';

const Wrapper = styled.section`
.header{
    position: relative;
    width: 100%;
    left: 0;
    top: 0;
    background-color: #E5E5E5;
}

.imageLogo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: auto;
    width: 25%;
}

.form-control-dark {
    border-color: var(--bs-gray);
  }
  .form-control-dark:focus {
    border-color: #fff;
    box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
  }
  
  .text-small {
    font-size: 85%;
  }
  
  .dropdown-toggle {
    outline: 0;
  }
  
  `

  export default Wrapper
  