import * as React from 'react';
import {findDOMNode} from 'react-dom';

const AUTHOR_REPO = 'ericgio/react-bootstrap-typeahead';

class GitHubStarsButton extends React.Component {
  componentDidMount() {
    const node = findDOMNode(this);
    node.dataset.size = window.innerWidth > 480 ? 'large': null;
  }

  render() {
    return (
      <a
        aria-label={`Star ${AUTHOR_REPO} on GitHub`}
        className="github-button"
        data-count-aria-label="# stargazers on GitHub"
        data-count-href={`/${AUTHOR_REPO}/stargazers`}
        data-show-count={true}
        href={`https://github.com/${AUTHOR_REPO}`}>
        Star
      </a>
    );
  }
}

export default GitHubStarsButton;
