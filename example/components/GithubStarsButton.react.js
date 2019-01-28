import React from 'react';

const AUTHOR_REPO = 'ericgio/react-bootstrap-typeahead';

class GitHubStarsButton extends React.Component {
  componentDidMount() {
    this._node.dataset.size = window.innerWidth > 480 ? 'large' : null;
  }

  render() {
    return (
      <a
        aria-label={`Star ${AUTHOR_REPO} on GitHub`}
        className="github-button"
        data-count-aria-label="# stargazers on GitHub"
        data-count-href={`/${AUTHOR_REPO}/stargazers`}
        data-show-count
        href={`https://github.com/${AUTHOR_REPO}`}
        ref={(node) => this._node = node}>
        Star
      </a>
    );
  }
}

export default GitHubStarsButton;
