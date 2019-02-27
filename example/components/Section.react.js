import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor.react';
import { withContext } from './Context.react';
import ScrollSpy from './ScrollSpy.react';

import getIdFromTitle from '../util/getIdFromTitle';

const Section = ({ children, onAfter, onBefore, title }) => {
  const id = getIdFromTitle(title);
  return (
    <section className="section">
      <ScrollSpy
        href={`#${id}`}
        onAfter={onAfter}
        onBefore={onBefore}
      />
      <h1 className="page-header">
        <Anchor id={id}>
          {title}
        </Anchor>
      </h1>
      {children}
    </section>
  );
};

Section.propTypes = {
  onAfter: PropTypes.func.isRequired,
  onBefore: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default withContext(Section, ['onAfter', 'onBefore']);
