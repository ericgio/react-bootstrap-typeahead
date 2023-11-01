/* eslint-disable import/no-unresolved */

import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

interface Item {
  avatar_url: string;
  id: string;
  login: string;
}

interface Response {
  items: Item[];
}

/* example-start */
const SEARCH_URI = 'https://api.github.com/search/users';

const AsyncExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Item[]>([]);

  const handleSearch = (query: string) => {
    setIsLoading(true);

    fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
      .then((resp) => resp.json())
      .then(({ items }: Response) => {
        setOptions(items);
        setIsLoading(false);
      });
  };

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="login"
      minLength={3}
      onSearch={handleSearch}
      options={options}
      placeholder="Search for a Github user..."
      renderMenuItemChildren={(option: Item) => (
        <>
          <img
            alt={option.login}
            src={option.avatar_url}
            style={{
              height: '24px',
              marginRight: '10px',
              width: '24px',
            }}
          />
          <span>{option.login}</span>
        </>
      )}
    />
  );
};
/* example-end */

export default AsyncExample;
