let idCounter = 0;

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}

export function pick<T, K extends keyof T>(obj: T, keys: K[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export function uniqueId(prefix?: string): string {
  idCounter += 1;
  return (prefix == null ? '' : String(prefix)) + idCounter;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const once = <T extends (...args: any) => any>(func: T): T => {
  let called = false;
  let result: unknown;
  // @ts-ignore
  return (...args) => {
    if (!called) {
      result = func(...args)
      called = true;
    }
    return result
  }
}
