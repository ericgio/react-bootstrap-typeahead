/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import { groupBy } from 'lodash';
import React, { Fragment } from 'react';
import { FormControl, FormGroup } from 'react-bootstrap';
import { Highlighter, hintContainer, Menu, MenuItem, Token, Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

const RADIO_OPTIONS = [
  { label: 'Custom input', value: 'renderInput' },
  { label: 'Custom menu', value: 'renderMenu' },
  { label: 'Custom menu item contents', value: 'renderMenuItemChildren' },
  { label: 'Custom token', value: 'renderToken' },
];

/* example-start */
const HintedFormControl = hintContainer(React.forwardRef((props, ref) => (
  // React-Bootstrap < 1.0.0 takes an `inputRef` rather than forwarding the ref.
  <FormControl {...props} inputRef={ref} />
)));

class RenderingExample extends React.Component {
  state = {
    selectedOption: 'renderInput',
  };

  render() {
    const { selectedOption } = this.state;
    const props = {};

    switch (selectedOption) {
      case 'renderInput':
        props.renderInput = this._renderInput;
        break;
      case 'renderMenu':
        props.renderMenu = this._renderMenu;
        break;
      case 'renderMenuItemChildren':
        props.renderMenuItemChildren = this._renderMenuItemChildren;
        break;
      case 'renderToken':
        props.multiple = true;
        props.renderToken = this._renderToken;
        break;
      default:
        break;
    }

    return (
      <Fragment>
        <Typeahead
          {...props}
          id="rendering-example"
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {RADIO_OPTIONS.map(({ label, value }) => (
            <Control
              checked={selectedOption === value}
              key={value}
              onChange={(e) => this.setState({ selectedOption: value })}
              type="radio"
              value={value}>
              {label}
            </Control>
          ))}
        </FormGroup>
      </Fragment>
    );
  }

  _renderInput = (inputProps) => {
    return <HintedFormControl {...inputProps} />;
  }

  _renderMenu = (results, menuProps, state) => {
    let index = 0;
    const regions = groupBy(results, 'region');
    const items = Object.keys(regions).sort().map((region) => (
      <Fragment key={region}>
        {index !== 0 && <Menu.Divider />}
        <Menu.Header>{region}</Menu.Header>
        {regions[region].map((i) => {
          const item =
            <MenuItem key={index} option={i} position={index}>
              <Highlighter search={state.text}>
                {i.name}
              </Highlighter>
            </MenuItem>;

          index += 1;
          return item;
        })}
      </Fragment>
    ));

    return <Menu {...menuProps}>{items}</Menu>;
  }

  _renderMenuItemChildren = (option, props, index) => {
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

  _renderToken = (option, props, index) => {
    return (
      <Token
        key={index}
        onRemove={props.onRemove}
        option={option}>
        {`${option.name} (Pop: ${option.population.toLocaleString()})`}
      </Token>
    );
  }
}
/* example-end */

export default RenderingExample;
