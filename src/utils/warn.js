/**
 * This code is copied from: https://github.com/ReactTraining/react-router/blob/master/modules/routerWarning.js
 */

import warning from 'warning';

let warned = {};

export default function warn(falseToWarn, message, ...args) {
  // Only issue deprecation warnings once.
  if (!falseToWarn && message.indexOf('deprecated') !== -1) {
    if (warned[message]) {
      return;
    }
    warned[message] = true;
  }

  message = `[react-bootstrap-typeahead] ${message}`;
  warning(falseToWarn, message, ...args);
}

export function _resetWarned() {
  warned = {};
}
