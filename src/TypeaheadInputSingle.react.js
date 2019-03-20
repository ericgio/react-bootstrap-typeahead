import cx from 'classnames';
import React from 'react';

import hintContainer from './containers/hintContainer';
import inputContainer from './containers/inputContainer';
import {mapClassNamesToCssModules} from './utils';

class TypeaheadInputSingle extends React.Component {
  render() {
    const {className, inputRef, cssModules, ...props} = this.props;
    return (
      <input
        {...props}
        className={
          mapClassNamesToCssModules(
            cx('rbt-input-main', 'form-control', className), cssModules
          )
        }
        ref={inputRef}
      />
    );
  }
}

export default inputContainer(hintContainer(TypeaheadInputSingle));
