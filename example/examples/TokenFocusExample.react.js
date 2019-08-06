import React, {Fragment} from 'react';

import {Typeahead} from '../../src';
import options from '../exampleData';

/* example-start */
class TokenFocusExample extends React.Component {
  state = {
    selected: undefined,
  };

  render() {
    const {selected} = this.state;

    return (
      <Fragment>
        <Typeahead
          clearButton
          defaultSelected={options.slice(0, 3)}
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
          onTokenFocus={this._onTokenFocus}
        />
        {selected ? <span>{selected} selected.</span> : null}
      </Fragment>
    );
  }

  _onTokenFocus = (option, focused) => {
    this.setState({
      selected: focused ? option.name : undefined,
    });
  }
}
/* example-start */

export default TokenFocusExample;
