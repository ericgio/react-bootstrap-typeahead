import React from 'react';

import { version } from '../../../package.json';

import Container from './Container.react';
import GithubStarsButton from './GithubStarsButton.react';

const AUTHOR_GITHUB_URL = 'https://github.com/ericgio';
const BASE_GITHUB_URL = `${AUTHOR_GITHUB_URL}/react-bootstrap-typeahead`;

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
    href="https://www.npmjs.com/package/react-bootstrap-typeahead"
    rel="noreferrer noopener"
    target="_blank">
    v{version}
  </a>;

const PageFooter = () => (
  <footer className="bs-docs-footer">
    <Container>
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
        <li>Licensed under {licenseLink}</li>
        <li>Current version: {versionLink}</li>
      </ul>
      <GithubStarsButton />
    </Container>
  </footer>
);

export default PageFooter;
