/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';

/* example-start */
const options = [
  'Warsaw',
  'Kraków',
  'Łódź',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Szczecin',
  'Bydgoszcz',
  'Lublin',
  'Katowice',
  'Białystok',
  'Gdynia',
  'Częstochowa',
  'Radom',
  'Sosnowiec',
  'Toruń',
  'Kielce',
  'Gliwice',
  'Zabrze',
  'Bytom',
  'Olsztyn',
  'Bielsko-Biała',
  'Rzeszów',
  'Ruda Śląska',
  'Rybnik',
];

const FilteringExample = () => {
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(true);

  return (
    <Fragment>
      <Typeahead
        caseSensitive={caseSensitive}
        id="filtering-example"
        ignoreDiacritics={ignoreDiacritics}
        options={options}
        placeholder="Cities in Poland..."
      />
      <FormGroup>
        <Control
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
          type="checkbox">
          Case-sensitive filtering
        </Control>
        <Control
          checked={!ignoreDiacritics}
          onChange={(e) => setIgnoreDiacritics(!e.target.checked)}
          type="checkbox">
          Account for diacritical marks
        </Control>
      </FormGroup>
    </Fragment>
  );
};
/* example-end */

export default FilteringExample;
