import React, {PropTypes} from 'react';

import Anchor from './Anchor';
import ScrollSpy from './ScrollSpy';

import getIdFromTitle from '../util/getIdFromTitle';

const sectionContainer = Component => (
  React.createClass({
    contextTypes: {
      onAfter: PropTypes.func.isRequired,
      onBefore: PropTypes.func.isRequired,
    },

    render() {
      return <Component {...this.props} {...this.context} />;
    },
  })
);

const Section = ({children, onAfter, onBefore, title}) => {
  const id = getIdFromTitle(title);
  return (
    <section className="section">
      <ScrollSpy
        href={`#${id}`}
        onAfter={onAfter}
        onBefore={onBefore}
      />
      <h1 className="page-header">
        <Anchor id={id}>{title}</Anchor>
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

export default sectionContainer(Section);
