import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor.react';

import getIdFromTitle from '../util/getIdFromTitle';

const Title = ({ children }) => (
  <h2>
    <Anchor id={getIdFromTitle(children)}>
      {children}
    </Anchor>
  </h2>
);

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
