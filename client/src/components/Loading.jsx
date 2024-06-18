import PropTypes from 'prop-types';
import Wrapper from '../assets/wrappers/Loading';

const Loading = () => {
  return (
    <Wrapper>
    <div className="loader">
    </div>
    </Wrapper>
  );
};

Loading.propTypes = {
  center: PropTypes.bool,
  message: PropTypes.string,
};

export default Loading;
