'use strict';

import cx from 'classnames';
import {range} from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import Typeahead from '../src/Typeahead.react';

import getOptionLabel from '../src/utils/getOptionLabel';
import states from './exampleData';

const bigData = range(0, 2000).map(option => option.toString());
const PRESELECTED_COUNT = 4;

require('../css/Token.css');
require('../css/Typeahead.css');

const Button = props => (
  <button
    {...props}
    className="btn btn-default"
  />
);

const Checkbox = props => (
  <div className={cx('checkbox', {'disabled': props.disabled})}>
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

const ExampleSection = props => (
  <div className="example-section">
    <h4>{props.title}</h4>
    {props.children}
  </div>
);

const Example = React.createClass({

  getInitialState() {
    return {
      align: 'justify',
      alignMenu: false,
      allowNew: false,
      customMenuItemChildren: false,
      disabled: false,
      largeDataSet: false,
      minLength: 0,
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
      minLength,
      multiple,
      preSelected,
      selected,
      text,
    } = this.state;

    let props = {allowNew, disabled, multiple, selected};

    if (customMenuItemChildren) {
      props.renderMenuItemChildren = this._renderMenuItemChildren;
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
            align={align}
            labelKey="name"
            minLength={minLength}
            name="typeahead"
            onChange={selected => this.setState({selected})}
            onInputChange={text => this.setState({text})}
            options={largeDataSet ? bigData : states}
            placeholder="Choose a state..."
            ref="typeahead"
            selected={selected}
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
              <Checkbox
                checked={!!minLength}
                name="minLength"
                onChange={this._handleChange}>
                Require minimum text input before showing results
              </Checkbox>
            </div>
          </ExampleSection>
          <ExampleSection title="Typeahead Methods">
            <div className="btn-toolbar">
              <Button
                onClick={() => this.refs.typeahead.getInstance().clear()}>
                Clear
              </Button>
              <Button
                onClick={() => this.refs.typeahead.getInstance().focus()}>
                Focus
              </Button>
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
      selected.map(option => getOptionLabel(option, 'name')).join(', ') :
      <div className="text-muted">No items selected.</div>;
  },

  _renderAlignmentSelector() {
    const {align, alignMenu} = this.state;

    return (
      <select
        disabled={!alignMenu}
        onChange={e => this.setState({align: e.target.value})}
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
        if (this.state.preSelected) {
          const options = checked ? bigData : states;
          newState.selected = options.slice(0, PRESELECTED_COUNT);
        }
        break;
      case 'preSelected':
        let count = this.state.multiple ? PRESELECTED_COUNT : 1;
        let options = this.state.largeDataSet ? bigData : states;
        newState.selected = checked ? options.slice(0, count) : [];
        break;
      case 'minLength':
        newState.minLength = checked ? 1 : 0;
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
