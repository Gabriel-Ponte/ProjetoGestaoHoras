import PropTypes from 'prop-types';
import LoadingState from '@/components/ui/LoadingState';

/**
 * Loading — full-area page loader. Thin wrapper over the design-system
 * LoadingState so every spinner in the app shares one look. Kept as its own
 * component (and API) because ~20 screens import it directly.
 */
const Loading = ({ message }) => <LoadingState message={message} size={60} />;

Loading.propTypes = {
  center: PropTypes.bool,
  message: PropTypes.string,
};

export default Loading;
