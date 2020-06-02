/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Container } from 'react-bootstrap';

import GithubStarsButton from './GithubStarsButton';

import { version } from '../../../package.json';

const AUTHOR_GITHUB_URL = 'https://github.com/ericgio';
const BASE_GITHUB_URL = `${AUTHOR_GITHUB_URL}/react-bootstrap-typeahead`;
const BOOTSTRAP_VERSION = '4.4.1';

const authorLink =
  <a
    href={AUTHOR_GITHUB_URL}
    rel="author noreferrer noopener"
    target="_blank">
    Eric Giovanola
  </a>;

const currentYear = (new Date()).getFullYear();
const footerLinks = [
  { href: BASE_GITHUB_URL, label: 'GitHub' },
  { href: `${BASE_GITHUB_URL}/issues`, label: 'Issues' },
  { href: `${BASE_GITHUB_URL}/releases`, label: 'Releases' },
];

const licenseLink =
  <a
    href={`${BASE_GITHUB_URL}/blob/master/LICENSE.md`}
    rel="license noreferrer noopener"
    target="_blank">
    MIT
  </a>;

const versionLink =
  <a
    href={`${BASE_GITHUB_URL}/releases`}
    rel="noreferrer noopener"
    target="_blank">
    v{version}
  </a>;

const bsLink =
  <a
    href="https://getbootstrap.com/docs/4.4"
    rel="noreferrer noopener"
    target="_blank">
    v{BOOTSTRAP_VERSION}
  </a>;

const PageFooter = () => (
  <footer className="bs-docs-footer">
    <Container fluid="md">
      <ul className="bs-docs-footer-links">
        {footerLinks.map(({ href, label }) => (
          <li key={label}>
            <a href={href} rel="noreferrer noopener" target="_blank">
              {label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="bs-docs-footer-links">
        <li>Copyright © {currentYear} {authorLink}</li>
        <li>License: {licenseLink}</li>
        <li>Version: {versionLink}</li>
        <li>Bootstrap Version: {bsLink}</li>
      </ul>
      <GithubStarsButton />
    </Container>
  </footer>
);

export default PageFooter;
