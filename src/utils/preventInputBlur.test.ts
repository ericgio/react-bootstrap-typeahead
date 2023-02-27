import { MouseEvent } from 'react';
import preventInputBlur from './preventInputBlur';

const mouseEvent = {
  preventDefault: jest.fn(),
} as unknown as MouseEvent<HTMLInputElement>;

describe('preventInputBlur', () => {
  it('calls `preventDefault` on the event', () => {
    preventInputBlur(mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
  });
});
