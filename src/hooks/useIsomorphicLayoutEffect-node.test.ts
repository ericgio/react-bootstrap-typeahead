/**
 * @jest-environment node
 */
import { useEffect } from 'react';
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

describe('useIsomorphicLayoutEffect in node', () => {
    it('window in node', () => {
        expect(useIsomorphicLayoutEffect).toEqual(useEffect);
    });
});
