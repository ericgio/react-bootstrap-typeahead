/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

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
    <>
      <Typeahead
        caseSensitive={caseSensitive}
        id="filtering-example"
        ignoreDiacritics={ignoreDiacritics}
        options={options}
        placeholder="Cities in Poland..."
      />
      <Form.Group>
        <Form.Check
          checked={caseSensitive}
          id="case-sensitive-filtering"
          label="Case-sensitive filtering"
          onChange={(e) => setCaseSensitive(e.target.checked)}
          type="checkbox"
        />
        <Form.Check
          checked={!ignoreDiacritics}
          id="diacritical-marks"
          label="Account for diacritical marks"
          onChange={(e) => setIgnoreDiacritics(!e.target.checked)}
          type="checkbox"
        />
      </Form.Group>
    </>
  );
};
/* example-end */

export default FilteringExample;
