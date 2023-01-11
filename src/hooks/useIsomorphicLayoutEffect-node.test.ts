/**
 * @jest-environment node
 */
import { useEffect } from 'react';
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

describe('useIsomorphicLayoutEffect in node', () => {
    it('window in browser', () => {
        expect(useIsomorphicLayoutEffect).toEqual(useEffect);
    });
});