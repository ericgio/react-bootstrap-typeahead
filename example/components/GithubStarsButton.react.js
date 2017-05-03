import React from 'react';
import {findDOMNode} from 'react-dom';

const AUTHOR_REPO = 'ericgio/react-bootstrap-typeahead';

class GitHubStarsButton extends React.Component {
  componentDidMount() {
    const node = findDOMNode(this);
    node.dataset.style = window.innerWidth > 480 ? 'mega': null;
  }

  render() {
    return (
      <a
        aria-label={`Star ${AUTHOR_REPO} on GitHub`}
        className="github-button"
        data-count-api={`/repos/${AUTHOR_REPO}#stargazers_count`}
        data-count-aria-label="# stargazers on GitHub"
        data-count-href={`/${AUTHOR_REPO}/stargazers`}
        href={`https://github.com/${AUTHOR_REPO}`}>
        Star
      </a>
    );
  }
}

export default GitHubStarsButton;
