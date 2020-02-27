/* eslint-disable import/no-extraneous-dependencies */

import { pick } from 'lodash';
import React from 'react';

const Context = React.createContext({});

export const withContext = (Component, values) => (props) => (
  <Context.Consumer>
    {(context) => <Component {...props} {...pick(context, values)} />}
  </Context.Consumer>
);

export default Context;
