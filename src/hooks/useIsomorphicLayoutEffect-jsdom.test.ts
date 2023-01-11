/**
 * @jest-environment jsdom
 */
import { useLayoutEffect } from 'react';
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

describe('useIsomorphicLayoutEffect in jsdom', () => {
    it('window in browser', () => {
        expect(useIsomorphicLayoutEffect).toEqual(useLayoutEffect);
    });
})