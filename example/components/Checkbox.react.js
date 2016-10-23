import cx from 'classnames';
import React from 'react';

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

export default Checkbox;
