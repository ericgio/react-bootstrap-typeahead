import React from 'react';
// import {Checkbox} from 'reactstrap';

import {Typeahead} from '../../src/';

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

/* example-start */
class FilteringExample extends React.Component {
  state = {
    caseSensitive: false,
    ignoreDiacritics: true,
  };

  render() {
    const {caseSensitive, ignoreDiacritics} = this.state;

    return (
      <div>
        <Typeahead
          {...this.state}
          options={options}
          placeholder="Cities in Poland..."
        />
        <span>
          <input checked={caseSensitive}
            onChange={(e) => this.setState({caseSensitive: e.target.checked})}
            type="checkbox"
          />
          <label>Case-sensitive filtering</label>
        </span>
        <span>
          <input checked={!ignoreDiacritics}
            onChange={(e) => {
              this.setState({ignoreDiacritics: !e.target.checked});
            }}
            type="checkbox"
          />
          <label>Don't ignore diacritical marks</label>
        </span>
      </div>
    );
  }
}
/* example-end */

export default FilteringExample;
