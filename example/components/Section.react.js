import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor';
import ScrollSpy from './ScrollSpy';

import getIdFromTitle from '../util/getIdFromTitle';

const sectionContainer = Component => {
  class WrappedSection extends React.Component {
    render() {
      return <Component {...this.props} {...this.context} />;
    }
  }

  WrappedSection.contextTypes = {
    onAfter: PropTypes.func.isRequired,
    onBefore: PropTypes.func.isRequired,
  };

  return WrappedSection;
};

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
