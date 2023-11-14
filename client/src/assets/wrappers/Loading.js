import styled from 'styled-components';

const Wrapper = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust the height based on your layout needs */

  .loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Wrapper;
