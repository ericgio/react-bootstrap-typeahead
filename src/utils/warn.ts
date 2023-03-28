import warning from 'warning';

let warned: Record<string, boolean> = {};

/**
 * Copied from: https://github.com/ReactTraining/react-router/blob/master/modules/routerWarning.js
 */
export default function warn(
  falseToWarn: boolean,
  message: string,
  ...args: unknown[]
): void {
  // Only issue deprecation warnings once.
  if (!falseToWarn && message.indexOf('deprecated') !== -1) {
    if (warned[message]) {
      return;
    }
    warned[message] = true;
  }

  warning(falseToWarn, `[react-bootstrap-typeahead] ${message}`, ...args);
}

export function resetWarned(): void {
  warned = {};
}
