'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/Typeahead.react';

import cx from 'classnames';
import {range} from 'lodash';
import states from './exampleData';

const CENSUS_URL = 'http://www.census.gov/2010census/data/';

const Checkbox = function(props) {
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
        {props.label}
      </label>
    </div>
  );
};

const Example = React.createClass({

  getInitialState() {
    return {
      allowNew: false,
      customMenuItemChildren: false,
      disabled: false,
      largeDataSet: false,
      multiple: false,
      preSelected: false,
      selected: [],
    };
  },

  render() {
    const {
      allowNew,
      customMenuItemChildren,
      disabled,
      largeDataSet,
      multiple,
      preSelected,
      selected,
    } = this.state;

    let props = {allowNew, disabled, multiple, selected};

    if (customMenuItemChildren) {
      props.renderMenuItemChildren = this._renderMenuItemChildren;
    }

    let bigData = range(0, 2000).map((option) => {
      return {name: option.toString()};
    });

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
            labelKey="name"
            onChange={(selected) => this.setState({selected})}
            options={largeDataSet ? bigData : states}
            placeholder="Choose a state..."
          />
          <div className="example-section">
            <h4>Options</h4>
            <div className="form-group">
              <Checkbox
                checked={disabled}
                label="Disable input"
                name="disabled"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={multiple}
                label="Allow multiple selections (tokenizer)"
                name="multiple"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={preSelected}
                label="Pre-populate the input"
                name="preSelected"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={customMenuItemChildren}
                disabled={largeDataSet}
                label="Customize menu item children"
                name="customMenuItemChildren"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={allowNew}
                label="Create new options on the fly"
                name="allowNew"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={largeDataSet}
                label="Paginate large data sets"
                name="largeDataSet"
                onChange={this._handleChange}
              />
            </div>
          </div>
          <div className="example-section">
            <h4>Selected Options</h4>
            {selected.map((option) => option.name).join(', ')}
          </div>
        </div>
      </div>
    );
  },

  _renderMenuItemChildren(props, option, idx) {
    return (
      <div>
        <strong>{option.name}</strong>
        <div>Population: {option.population.toLocaleString()}</div>
      </div>
    );
  },

  _handleChange(e) {
    const {checked, name} = e.target;

    let newState = {};
    newState[name] = checked;

    switch (name) {
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
