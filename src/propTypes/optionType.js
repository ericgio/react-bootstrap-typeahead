import PropTypes from 'prop-types';

export default PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.object.isRequired),
  PropTypes.arrayOf(PropTypes.string.isRequired),
]);
