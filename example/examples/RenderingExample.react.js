/* eslint-disable import/no-extraneous-dependencies,react/no-multi-comp */

import { groupBy, map } from 'lodash';
import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';

import Control from '../components/Control.react';
import { Highlighter, hintContainer, Menu, MenuItem, Token, Typeahead } from '../../src';
import options from '../exampleData';

const RADIO_OPTIONS = [
  { label: 'Custom input', value: 'renderInput' },
  { label: 'Custom menu', value: 'renderMenu' },
  { label: 'Custom menu item contents', value: 'renderMenuItemChildren' },
  { label: 'Custom token', value: 'renderToken' },
];

/* example-start */
class Input extends React.Component {
  render() {
    const { inputRef, ...props } = this.props;
    return <input {...props} ref={inputRef} />;
  }
}

const HintedInput = hintContainer(Input);

class RenderingExample extends React.Component {
  state = {
    selectedOption: 'renderInput',
  };

  render() {
    const { selectedOption } = this.state;
    const props = {};

    switch (selectedOption) {
      case 'renderInput':
        props.style = { display: 'inline-block' };
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
    return (
      <HintedInput {...inputProps} />
    );
  }

  _renderMenu = (results, menuProps) => {
    let idx = 0;
    const grouped = groupBy(results, (r) => r.region);
    const items = Object.keys(grouped).sort().map((region) => [
      !!idx && <Menu.Divider key={`${region}-divider`} />,
      <Menu.Header key={`${region}-header`}>
        {region}
      </Menu.Header>,
      map(grouped[region], (state) => {
        const item =
          <MenuItem key={idx} option={state} position={idx}>
            <Highlighter search={menuProps.text}>
              {state.name}
            </Highlighter>
          </MenuItem>;

        idx++; /* eslint-disable-line no-plusplus */
        return item;
      }),
    ]);

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
        onRemove={props.onRemove}>
        {`${option.name} (Pop: ${option.population.toLocaleString()})`}
      </Token>
    );
  }
}
/* example-end */

export default RenderingExample;
