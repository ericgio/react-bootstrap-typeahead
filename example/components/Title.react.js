import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor';

import getIdFromTitle from '../util/getIdFromTitle';

const Title = ({children}) => (
  <h3>
    <Anchor id={getIdFromTitle(children)}>
      {children}
    </Anchor>
  </h3>
);

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
