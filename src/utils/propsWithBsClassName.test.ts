import propsWithBsClassName from './propsWithBsClassName';

describe('propsWithBsClassName', () => {
  it('returns a basic classname', () => {
    const { className } = propsWithBsClassName({});
    expect(className).toBe('form-control rbt-input');
  });

  it('includes a classname for a large input', () => {
    const { className } = propsWithBsClassName({ size: 'lg' });
    expect(className).toContain('form-control-lg');
  });

  it('includes a classname for a small input', () => {
    const { className } = propsWithBsClassName({ size: 'sm' });
    expect(className).toContain('form-control-sm');
  });

  it('includes a classname for an invalid input', () => {
    const { className } = propsWithBsClassName({ isInvalid: true });
    expect(className).toContain('is-invalid');
  });

  it('includes a classname for a valid input', () => {
    const { className } = propsWithBsClassName({ isValid: true });
    expect(className).toContain('is-valid');
  });

  it('includes an arbitrary classname', () => {
    const { className } = propsWithBsClassName({ className: 'foo' });
    expect(className).toContain('foo');
  });

  it('returns pass-through props', () => {
    const { foo } = propsWithBsClassName({ foo: 'bar' });
    expect(foo).toBe('bar');
  });
});
