import React, {Children} from 'react';
import PropTypes from 'prop-types';
import {Col, Jumbotron, NavItem, Row} from 'react-bootstrap';

import Container from './Container';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMenu from './PageMenu';

import getIdFromTitle from '../util/getIdFromTitle';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeHref: window.location.hash,
    };
  }

  getChildContext() {
    return {
      onAfter: this._onAfter,
      onBefore: this._onBefore,
    };
  }

  componentWillMount() {
    this._hrefs = [];
    this._sections = [];

    Children.forEach(this.props.children, ({props}) => {
      this._hrefs.push(`#${getIdFromTitle(props.title)}`);
      this._sections.push(props.title);
    });
  }

  render() {
    const {children, title} = this.props;

    return (
      <div className="bs-docs-page">
        <PageHeader />
        <Jumbotron>
          <Container>
            <h1>{title}</h1>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col md={9}>
              {children}
            </Col>
            <Col className="bs-docs-sidebar-holder" md={3}>
              <PageMenu>
                {this._sections.map(this._renderMenuItem)}
              </PageMenu>
            </Col>
          </Row>
        </Container>
        <PageFooter />
      </div>
    );
  }

  _renderMenuItem = (title, idx) => {
    const href = `#${getIdFromTitle(title)}`;
    return (
      <NavItem
        active={href === this.state.activeHref}
        key={idx}
        onClick={() => this._handleMenuItemClick(href)}>
        {title}
      </NavItem>
    );
  }

  _handleMenuItemClick = activeHref => {
    window.location.hash = activeHref;
    this._updateActiveHref(activeHref);
  }

  _onAfter = href => {
    this._updateActiveHref(href);
  }

  _onBefore = href => {
    const index = this._hrefs.indexOf(href) - 1;
    this._updateActiveHref(this._hrefs[index]);
  }

  _updateActiveHref = (activeHref, callback) => {
    if (this._updateActiveHrefHandle != null) {
      return;
    }

    this._updateActiveHrefHandle = setTimeout(() => {
      this._updateActiveHrefHandle = null;
      this.setState({activeHref});
    });
  }
}

Page.childContextTypes = {
  onAfter: PropTypes.func.isRequired,
  onBefore: PropTypes.func.isRequired,
};

Page.propTypes = {
  title: PropTypes.node.isRequired,
};

export default Page;
