import PropTypes from 'prop-types';
import LoadingState from '@/components/ui/LoadingState';

/**
 * LoadingSmaller — compact inline loader (inside cards, rows, tight panels).
 * Thin wrapper over LoadingState in `inline` mode so it matches the app-wide
 * spinner while staying small. Kept as its own component for its many callers.
 */
const LoadingSmaller = ({ message }) => (
  <LoadingState inline size={38} message={message ?? null} />
);

LoadingSmaller.propTypes = {
  center: PropTypes.bool,
  message: PropTypes.string,
};

export default LoadingSmaller;
