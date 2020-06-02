import React, { useEffect, useRef } from 'react';

const AUTHOR_REPO = 'ericgio/react-bootstrap-typeahead';

const GitHubStarsButton = () => {
  const ref = useRef();

  // Set size to large on initial render.
  useEffect(() => { ref.current.dataset.size = 'large'; }, []);

  return (
    <a
      aria-label={`Star ${AUTHOR_REPO} on GitHub`}
      className="github-button"
      data-count-aria-label="# stargazers on GitHub"
      data-count-href={`/${AUTHOR_REPO}/stargazers`}
      data-show-count
      href={`https://github.com/${AUTHOR_REPO}`}
      ref={ref}>
      Star
    </a>
  );
};

export default GitHubStarsButton;
