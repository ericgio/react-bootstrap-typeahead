'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/Typeahead.react';

import cx from 'classnames';
import states from './exampleData';

const Checkbox = function(props) {
  return (
    <div className="checkbox">
      <label>
        <input
          checked={props.checked}
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
      customMenuItem: false,
      disabled: false,
      multiple: false,
      preSelected: false,
      selected: [],
    };
  },

  render() {
    const {
      allowNew,
      customMenuItem,
      disabled,
      multiple,
      preSelected,
      selected,
    } = this.state;

    let props = {allowNew, disabled, multiple, selected};
    if (customMenuItem) {
      props.renderMenuItem = this._renderMenuItem;
    }

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
            options={states}
            placeholder="Choose a state..."
          />
          {this._renderPopulationDataSource()}
          <div className="example-section">
            <h4>Options</h4>
            <div className="form-group">
              <Checkbox
                checked={disabled}
                label="Disabled"
                name="disabled"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={multiple}
                label="Multiple Selections"
                name="multiple"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={preSelected}
                label="Pre-Selected Options"
                name="preSelected"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={customMenuItem}
                label="Custom Menu Item"
                name="customMenuItem"
                onChange={this._handleChange}
              />
              <Checkbox
                checked={allowNew}
                label="Allow Custom Options"
                name="allowNew"
                onChange={this._handleChange}
              />
            </div>
          </div>
          <div className="example-section">
            <h4>Selected State(s)</h4>
            {selected.map((state) => state.label).join(', ')}
          </div>
        </div>
      </div>
    );
  },

  _renderPopulationDataSource() {
    let link =
      <a href="http://www.census.gov/2010census/data/" target="_blank">
        U.S. Census Bureau
      </a>;

    return (
      <div className="example-data-source">
        Data Source: {link}
      </div>
    );
  },

  _renderMenuItem(props, option, idx) {
    return (
      <li className={cx({'active': idx === props.activeIndex})} key={idx}>
        <a href="#" onClick={props.onClick.bind(null, option)}>
          <strong>{option.name}</strong>
          <div>
            Population: {option.population.toLocaleString()}
          </div>
        </a>
      </li>
    );
  },

  _handleChange(e) {
    const {checked, name} = e.target;

    let newState = {};
    newState[name] = checked;

    switch (name) {
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
