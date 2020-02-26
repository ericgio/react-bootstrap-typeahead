/* eslint-disable import/no-extraneous-dependencies */

import cx from 'classnames';
import React, { Children } from 'react';
import { Col, NavItem, Row } from 'react-bootstrap';

import Context from './Context.react';
import PageFooter from './PageFooter.react';
import PageHeader from './PageHeader.react';
import PageMenu from './PageMenu.react';

import getIdFromTitle from '../util/getIdFromTitle';
import { BS3, BS4, HASHES } from '../util/bsVersions';

class Page extends React.Component {
  _hrefs = [];
  _sections = [];

  state = {
    activeHref: window.location.hash,
    bsVersion: BS4,
  };

  constructor(props) {
    super(props);

    Children.forEach(props.children, (child) => {
      this._hrefs.push(`#${getIdFromTitle(child.props.title)}`);
      this._sections.push(child.props.title);
    });
  }

  render() {
    const { bsVersion } = this.state;

    return (
      <Context.Provider
        value={{
          isBS3: bsVersion === BS3,
          onAfter: this._onAfter,
          onBefore: this._onBefore,
        }}>
        <div
          className={cx('bs-docs-page', {
            bs4: bsVersion === BS4,
          })}>
          <PageHeader
            onVersionChange={this._handleVersionChange}
            selectedVersion={bsVersion}
          />
          <main className="container">
            <Row>
              <Col md={9}>
                {this.props.children}
              </Col>
              <Col md={3}>
                <PageMenu>
                  {this._sections.map(this._renderMenuItem)}
                </PageMenu>
              </Col>
            </Row>
          </main>
          <PageFooter />
        </div>
      </Context.Provider>
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

  _handleVersionChange = (bsVersion) => {
    if (bsVersion === this.state.bsVersion) {
      return;
    }

    const items = document.head.children;

    for (let ii = 0; ii < items.length; ii++) {
      const item = items[ii];
      if (item.href && item.href.indexOf('bootstrap.min.css') !== -1) {
        // `integrity` must be set before `href`.
        item.setAttribute('integrity', `sha384-${HASHES[bsVersion]}`);
        item.setAttribute(
          'href',
          `https://maxcdn.bootstrapcdn.com/bootstrap/${bsVersion}/css/bootstrap.min.css`
        );
        break;
      }
    }

    this.setState({ bsVersion });
  }

  _handleMenuItemClick = (activeHref) => {
    window.location.hash = activeHref;
    this._updateActiveHref(activeHref);
  }

  _onAfter = (href) => {
    this._updateActiveHref(href);
  }

  _onBefore = (href) => {
    const index = this._hrefs.indexOf(href) - 1;
    this._updateActiveHref(this._hrefs[index]);
  }

  _updateActiveHref = (activeHref) => {
    this.setState({ activeHref });
  }
}

export default Page;
