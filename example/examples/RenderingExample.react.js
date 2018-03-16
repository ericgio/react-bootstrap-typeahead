import {groupBy, map} from 'lodash';
import React from 'react';
import {FormGroup} from 'react-bootstrap';

import Control from '../components/Control';
import {Highlighter, Menu, MenuItem, Token, Typeahead} from '../../src/';
import options from '../../example/exampleData';

const MenuDivider = (props) => (
  <li className="divider dropdown-divider" role="separator" />
);
const MenuHeader = (props) => <li {...props} className="dropdown-header" />;

/* example-start */
class RenderingExample extends React.Component {
  state = {
    selectedOption: 'renderMenu',
  };

  render() {
    const {selectedOption} = this.state;
    const props = {};
    const radios = [
      {label: 'Custom menu', value: 'renderMenu'},
      {label: 'Custom menu item contents', value: 'renderMenuItemChildren'},
      {label: 'Custom token', value: 'renderToken'},
    ];

    switch (selectedOption) {
      case radios[0].value:
        props.renderMenu = this._renderMenu;
        break;
      case radios[1].value:
        props.renderMenuItemChildren = this._renderMenuItemChildren;
        break;
      case radios[2].value:
        props.multiple = true;
        props.renderToken = this._renderToken;
        break;
    }

    return (
      <div>
        <Typeahead
          {...props}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {radios.map(({label, value}) => (
            <Control
              checked={selectedOption === value}
              key={value}
              onChange={(e) => this.setState({selectedOption: value})}
              type="radio"
              value={value}>
              {label}
            </Control>
          ))}
        </FormGroup>
      </div>
    );
  }

  _renderMenu(results, menuProps) {
    let idx = 0;
    const grouped = groupBy(results, (r) => r.region);
    const items = Object.keys(grouped).sort().map((region) => {
      return [
        !!idx && <MenuDivider key={`${region}-divider`} />,
        <MenuHeader key={`${region}-header`}>
          {region}
        </MenuHeader>,
        map(grouped[region], (state) => {
          const item =
            <MenuItem key={idx} option={state} position={idx}>
              <Highlighter search={menuProps.text}>
                {state.name}
              </Highlighter>
            </MenuItem>;

          idx++;
          return item;
        }),
      ];
    });

    return <Menu {...menuProps}>{items}</Menu>;
  }

  _renderMenuItemChildren(option, props, index) {
    return [
      <Highlighter key="name" search={props.text}>
        {option.name}
      </Highlighter>,
      <div key="population">
        <small>
          Population: {option.population.toLocaleString()}
        </small>
      </div>,
    ];
  }

  _renderToken(option, props, index) {
    return (
      <Token
        key={index}
        onRemove={props.onRemove}>
        {`${option.name} (Pop: ${option.population.toLocaleString()})`}
      </Token>
    );
  }
}
/* example-end */

export default RenderingExample;
