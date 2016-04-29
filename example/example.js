'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/Typeahead.react';

import {range} from 'lodash';
import states from './exampleData';

const Checkbox = (props) => {
  return (
    <div className="checkbox">
      <label>
        <input
          checked={props.checked}
          disabled={props.disabled}
          name={props.name}
          onChange={props.onChange}
          type="checkbox"
        />
        {props.children || props.label}
      </label>
    </div>
  );
};

const ExampleSection = (props) => {
  return (
    <div className="example-section">
      <h4>{props.title}</h4>
      {props.children}
    </div>
  );
};

const Example = React.createClass({

  getInitialState() {
    return {
      align: 'justify',
      alignMenu: false,
      allowNew: false,
      customMenuItemChildren: false,
      disabled: false,
      largeDataSet: false,
      multiple: false,
      preSelected: false,
      selected: [],
      text: '',
    };
  },

  render() {
    const {
      align,
      alignMenu,
      allowNew,
      customMenuItemChildren,
      disabled,
      largeDataSet,
      multiple,
      preSelected,
      selected,
      text,
    } = this.state;

    let props = {allowNew, disabled, multiple, selected};

    if (customMenuItemChildren) {
      props.renderMenuItemChildren = this._renderMenuItemChildren;
    }

    let bigData = range(0, 2000).map((option) => ({name: option.toString()}));

    return (
      <div className="example">
        <div className="jumbotron">
          <div className="container">
            <h2>React Bootstrap Typeahead Example</h2>
          </div>
        </div>
        <div className="container">
          <Typeahead
            {...props}
            align={align}
            labelKey="name"
            onChange={(selected) => this.setState({selected})}
            onInputChange={(text) => this.setState({text})}
            options={largeDataSet ? bigData : states}
            placeholder="Choose a state..."
          />
          <ExampleSection title="Typeahead Options">
            <div className="form-group">
              <Checkbox
                checked={disabled}
                name="disabled"
                onChange={this._handleChange}>
                Disable input
              </Checkbox>
              <Checkbox
                checked={multiple}
                name="multiple"
                onChange={this._handleChange}>
                Allow multiple selections (tokenizer)
              </Checkbox>
              <Checkbox
                checked={preSelected}
                name="preSelected"
                onChange={this._handleChange}>
                Pre-populate the input
              </Checkbox>
              <Checkbox
                checked={customMenuItemChildren}
                disabled={largeDataSet}
                name="customMenuItemChildren"
                onChange={this._handleChange}>
                Customize menu item children
              </Checkbox>
              <Checkbox
                checked={allowNew}
                name="allowNew"
                onChange={this._handleChange}>
                Create new options on the fly
              </Checkbox>
              <Checkbox
                checked={largeDataSet}
                name="largeDataSet"
                onChange={this._handleChange}>
                Paginate large data sets
              </Checkbox>
              <Checkbox
                checked={alignMenu}
                name="alignMenu"
                onChange={this._handleChange}>
                Align menu: {this._renderAlignmentSelector()}
              </Checkbox>
            </div>
          </ExampleSection>
          <ExampleSection title="Selected Items">
            {this._renderSelectedItems(selected)}
          </ExampleSection>
          <ExampleSection title="Input Text">
            {text || <div className="text-muted">No text.</div>}
          </ExampleSection>
        </div>
      </div>
    );
  },

  _renderMenuItemChildren(props, option, idx) {
    return [
      <strong key="name">{option.name}</strong>,
      <div key="population">
        Population: {option.population.toLocaleString()}
      </div>,
    ];
  },

  _renderSelectedItems(selected) {
    return selected && selected.length ?
      selected.map((option) => option.name).join(', ') :
      <div className="text-muted">No items selected.</div>;
  },

  _renderAlignmentSelector() {
    const {align, alignMenu} = this.state;

    return (
      <select
        disabled={!alignMenu}
        onChange={(e) => this.setState({align: e.target.value})}
        value={align}>
        <option value="justify">Justify (default)</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    );
  },

  _handleChange(e) {
    const {checked, name} = e.target;

    let newState = {};
    newState[name] = checked;

    switch (name) {
      case 'alignMenu':
        if (!checked) {
          newState.align = this.getInitialState().align;
        }
        break;
      case 'largeDataSet':
        newState.customMenuItemChildren = false;
        break;
      case 'preSelected':
        let count = this.state.multiple ? 4 : 1;
        newState.selected = checked ? states.slice(0, count) : [];
        break;
      case 'multiple':
        let newSelection = this.state.selected.slice();
        !checked && newSelection.splice(1, newSelection.length);
        newState.selected = newSelection || [];
        break;
    }

    this.setState(newState);
  },
});

ReactDOM.render(<Example />, document.getElementById('root'));
