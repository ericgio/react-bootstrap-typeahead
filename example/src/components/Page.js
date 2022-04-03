import React, { Children } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';

import ExampleContext from './Context';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMenu from './PageMenu';

import getIdFromTitle from '../util/getIdFromTitle';

class Page extends React.Component {
  _hrefs = [];
  _sections = [];

  state = {
    activeHref: window.location.hash,
  };

  constructor(props) {
    super(props);

    Children.forEach(props.children, (child) => {
      this._hrefs.push(`#${getIdFromTitle(child.props.title)}`);
      this._sections.push(child.props.title);
    });
  }

  render() {
    return (
      <ExampleContext.Provider
        value={{
          onAfter: this._onAfter,
          onBefore: this._onBefore,
        }}>
        <div className="bs-docs-page">
          <PageHeader />
          <Container as="main" fluid="md">
            <Row>
              <Col md={9}>{this.props.children}</Col>
              <Col md={3}>
                <PageMenu>{this._sections.map(this._renderMenuItem)}</PageMenu>
              </Col>
            </Row>
          </Container>
          <PageFooter />
        </div>
      </ExampleContext.Provider>
    );
  }

  _renderMenuItem = (title, idx) => {
    const href = `#${getIdFromTitle(title)}`;
    return (
      <Nav.Item key={idx}>
        <Nav.Link
          active={href === this.state.activeHref}
          onClick={() => this._handleMenuItemClick(href)}>
          {title}
        </Nav.Link>
      </Nav.Item>
    );
  };

  _handleMenuItemClick = (activeHref) => {
    window.location.hash = activeHref;
    this._updateActiveHref(activeHref);
  };

  _onAfter = (href) => {
    this._updateActiveHref(href);
  };

  _onBefore = (href) => {
    const index = this._hrefs.indexOf(href) - 1;
    this._updateActiveHref(this._hrefs[index]);
  };

  _updateActiveHref = (activeHref) => {
    this.setState({ activeHref });
  };
}

export default Page;
