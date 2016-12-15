import {groupBy, map} from 'lodash';
import React from 'react';
import {Radio} from 'react-bootstrap';

import {Menu, MenuItem, Token, Typeahead} from '../../src/';
import options from '../../example/exampleData';

const MenuDivider = props => <li className="divider" role="separator" />;
const MenuHeader = props => <li {...props} className="dropdown-header" />;

/* example-start */
const RenderingExample = React.createClass({
  getInitialState() {
    return {
      selectedOption: 'renderMenu',
    };
  },

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
        {radios.map(({label, value}) => (
          <Radio
            checked={selectedOption === value}
            key={value}
            onChange={e => this.setState({selectedOption: value})}
            value={value}>
            {label}
          </Radio>
        ))}
      </div>
    );
  },

  _renderMenu(results, menuProps) {
    let idx = 0;
    const grouped = groupBy(results, r => r.region);
    const items = Object.keys(grouped).sort().map(region => {
      return [
        !!idx && <MenuDivider key={`${region}-divider`} />,
        <MenuHeader key={`${region}-header`}>
          {region}
        </MenuHeader>,
        map(grouped[region], state => {
          const item =
            <MenuItem key={idx} option={state} position={idx}>
              {state.name}
            </MenuItem>;

          idx++;
          return item;
        }),
      ];
    });

    return <Menu {...menuProps}>{items}</Menu>;
  },

  _renderMenuItemChildren(option, props, index) {
    return [
      <strong key="name">{option.name}</strong>,
      <div key="population">
        Population: {option.population.toLocaleString()}
      </div>,
    ];
  },

  _renderToken(option, onRemove, index) {
    return (
      <Token
        key={index}
        onRemove={onRemove}>
        {`${option.name} (Pop: ${option.population.toLocaleString()})`}
      </Token>
    );
  },
});
/* example-end */

export default RenderingExample;
