/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment } from 'react';
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

class FilteringExample extends React.Component {
  state = {
    caseSensitive: false,
    ignoreDiacritics: true,
  };

  render() {
    const { caseSensitive, ignoreDiacritics } = this.state;

    return (
      <Fragment>
        <Typeahead
          {...this.state}
          id="filtering-example"
          options={options}
          placeholder="Cities in Poland..."
        />
        <FormGroup>
          <Control
            checked={caseSensitive}
            onChange={(e) => this.setState({ caseSensitive: e.target.checked })}
            type="checkbox">
            Case-sensitive filtering
          </Control>
          <Control
            checked={!ignoreDiacritics}
            onChange={(e) => {
              this.setState({ ignoreDiacritics: !e.target.checked });
            }}
            type="checkbox">
            Account for diacritical marks
          </Control>
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default FilteringExample;
