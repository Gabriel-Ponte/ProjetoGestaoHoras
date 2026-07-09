import PropTypes from 'prop-types';
import Wrapper from '@/styles/LoadingSmaller';

const LoadingSmaller = () => {
  return (
    <Wrapper>
    <div className="loader">
    </div>
    </Wrapper>
  );
};

LoadingSmaller.propTypes = {
  center: PropTypes.bool,
  message: PropTypes.string,
};

export default LoadingSmaller;
