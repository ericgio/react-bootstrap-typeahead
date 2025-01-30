import cx from 'classnames';
import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Typeahead, { TypeaheadComponentProps } from './Typeahead';
import Hint from '../Hint';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

import options, { Option } from '../../tests/data';
import { noop } from '../../tests/helpers';

export default {
  title: 'Components/Typeahead',
  component: Typeahead,
  argTypes: {
    align: {
      options: ['justify', 'left', 'right'],
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    size: {
      options: ['default', 'sm', 'lg'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
    },
  },
} as Meta;

const defaultProps = {
  allowNew: false,
  clearButton: false,
  flip: true,
  id: 'rbt-id',
  isLoading: undefined,
  labelKey: 'name',
  multiple: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  onInputChange: noop,
  onKeyDown: noop,
  options,
  placeholder: 'Choose a state...',
  positionFixed: true,
};

const Template: StoryFn<TypeaheadComponentProps> = (args) => (
  <Typeahead {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  ...defaultProps,
  defaultSelected: options.slice(0, 4),
  multiple: true,
};

export const ClearButton = Template.bind({});
ClearButton.args = {
  ...defaultProps,
  clearButton: true,
  defaultSelected: options.slice(0, 1),
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  ...defaultProps,
  isLoading: true,
};

export const Pagination = Template.bind({});
Pagination.args = {
  ...defaultProps,
  maxResults: 10,
  paginate: true,
};

export const AllowNew = Template.bind({});
AllowNew.args = {
  ...defaultProps,
  allowNew: true,
};

export const DisabledItem = Template.bind({});
DisabledItem.args = {
  ...defaultProps,
  options: options.map((option) =>
    option.name === 'Alabama'
      ? { ...option, disabled: true }
      : { ...option, disabled: false }
  ),
};

export const CustomInput = Template.bind({});
CustomInput.args = {
  ...defaultProps,
  renderInput: ({ inputRef, referenceElementRef, ...inputProps }) => (
    <Hint>
      <div className="form-floating">
        <input
          {...inputProps}
          className="form-control"
          id="floatingInput"
          ref={(node) => {
            inputRef(node);
            referenceElementRef(node);
          }}
        />
        <label htmlFor="floatingInput">{inputProps.placeholder}</label>
      </div>
    </Hint>
  ),
};

export const CustomMenu = Template.bind({});
CustomMenu.args = {
  ...defaultProps,
  renderMenu: (results, menuProps) => (
    <Menu {...menuProps}>
      {/* Use `slice` to avoid mutating the original array */}
      {(results as Option[])
        .slice()
        .reverse()
        .map((r, index) => (
          <MenuItem key={r.name} option={r} position={index}>
            {r.name}
          </MenuItem>
        ))}
    </Menu>
  ),
};

export const InputGrouping = (args: TypeaheadComponentProps) => (
  <div
    className={cx('input-group', {
      'input-group-sm': args.size === 'sm',
      'input-group-lg': args.size === 'lg',
    })}>
    <span className="input-group-text">$</span>
    <Typeahead {...args} />
    <span className="input-group-text">.00</span>
  </div>
);
InputGrouping.args = {
  ...defaultProps,
};

export const Controlled = (args: TypeaheadComponentProps) => {
  const [selected, setSelected] = useState(args.selected || []);

  return <Typeahead {...args} onChange={setSelected} selected={selected} />;
};
Controlled.args = {
  ...defaultProps,
};

export const InputValidation = (args: TypeaheadComponentProps) => {
  let feedback;
  if (args.isValid) {
    feedback = 'Looks good!';
  }

  if (args.isInvalid) {
    feedback = 'Please provide a value!';
  }

  return (
    <div className="form-group">
      <Typeahead {...args} />
      <div
        className={cx({
          'valid-feedback': args.isValid,
          'invalid-feedback': args.isInvalid,
        })}>
        {feedback}
      </div>
    </div>
  );
};
InputValidation.args = {
  ...defaultProps,
  isValid: true,
  isInvalid: false,
};
