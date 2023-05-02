import Wrapper from '../assets/wrappers/ProjetoInfo';

const ProjetoInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className='icon'>{icon} </span>
      <span className='text'>{text} </span>
    </Wrapper>
  );
};
export default ProjetoInfo;
