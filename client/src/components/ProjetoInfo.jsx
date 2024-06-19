import Wrapper from '../assets/wrappers/ProjetoInfo';
import PropTypes from 'prop-types'; 

const ProjetoInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className='icon'>{icon} </span>
      <span className='text'>{text} </span>
    </Wrapper>
  );
};


ProjetoInfo.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}
export default ProjetoInfo;
