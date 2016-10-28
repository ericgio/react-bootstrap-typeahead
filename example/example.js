'use strict';

import {range} from 'lodash';
import React from 'react';
import {render} from 'react-dom';

import Token from '../src/Token.react';
import Typeahead from '../src/Typeahead.react';

import Button from './components/Button.react';
import Checkbox from './components/Checkbox.react';
import CustomMenu from './components/CustomMenu.react';
import ExampleSection from './components/ExampleSection.react';

import getOptionLabel from '../src/utils/getOptionLabel';
import states from './exampleData';

import '../css/Token.css';
import '../css/Typeahead.css';

const bigData = range(0, 2000).map(option => option.toString());
const PRESELECTED_COUNT = 4;

const Example = React.createClass({
  getInitialState() {
    return {
      align: 'justify',
      alignMenu: false,
      allowNew: false,
      bsSize: undefined,
      customLabelKey: false,
      customMenu: false,
      customMenuItemChildren: false,
      customToken: false,
      disabled: false,
      dropup: false,
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
      bsSize,
      customLabelKey,
      customMenu,
      customMenuItemChildren,
      customToken,
      disabled,
      dropup,
      largeDataSet,
      minLength,
      multiple,
      preSelected,
      selected,
      text,
    } = this.state;

    const props = {
      align,
      allowNew,
      bsSize,
      disabled,
      dropup,
      minLength,
      multiple,
      selected,
    };


    if (customMenu) {
      props.renderMenu = this._renderMenu;
    }

    if (customMenuItemChildren) {
      props.renderMenuItemChildren = this._renderMenuItemChildren;
    }

    if (customToken) {
      props.renderToken = (option, onRemove, idx) => (
        <Token
          disabled={disabled}
          key={idx}
          onRemove={onRemove}>
          {`${option.name} (Pop: ${option.population.toLocaleString()})`}
        </Token>
      );
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
            labelKey={customLabelKey ? this._labelKey : 'name'}
            name="typeahead"
            onChange={selected => this.setState({selected})}
            onInputChange={text => this.setState({text})}
            options={largeDataSet ? bigData : states}
            placeholder="Choose a state..."
            ref="typeahead"
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
                checked={preSelected}
                name="preSelected"
                onChange={this._handleChange}>
                Pre-populate the input
              </Checkbox>
              <Checkbox
                checked={customLabelKey}
                name="customLabelKey"
                onChange={this._handleChange}>
                Customize label key
              </Checkbox>
              <Checkbox
                checked={customMenu}
                name="customMenu"
                onChange={this._handleChange}>
                Customize menu
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
                checked={dropup}
                name="dropup"
                onChange={this._handleChange}>
                Menu dropup
              </Checkbox>
              <Checkbox
                checked={!!minLength}
                name="minLength"
                onChange={this._handleChange}>
                Require minimum text input before showing results
              </Checkbox>
              <Checkbox
                checked={multiple}
                name="multiple"
                onChange={this._handleChange}>
                Allow multiple selections (tokenizer)
              </Checkbox>
              <Checkbox
                checked={customToken}
                disabled={!multiple || largeDataSet}
                name="customToken"
                onChange={this._handleChange}>
                Customize tokens (multiple selections only)
              </Checkbox>
            </div>
          </ExampleSection>
          <ExampleSection title="Size">
            <select
              onChange={e => {
                const {value} = e.target;
                const bsSize = +value !== -1 ? value : undefined;
                this.setState({bsSize});
              }}
              value={bsSize}>
              <option value={-1}>Default</option>
              <option value="small">Small</option>
              <option value="large">Large</option>
            </select>
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

  _labelKey(option) {
    return `${option.capital}, ${option.name}`;
  },

  _renderMenu(results, props) {
    return <CustomMenu {...props} results={results} />;
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
        newState.customToken = false;
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
        newState.customToken = false;
        break;
    }

    this.setState(newState);
  },
});

render(<Example />, document.getElementById('root'));
