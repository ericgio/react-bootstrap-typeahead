import React from 'react';
import { Waypoint } from 'react-waypoint';

interface ScrollSpyProps {
  href: string;
  onBefore: (href: string) => void;
  onAfter: (href: string) => void;
}

const ScrollSpy = ({ href, onBefore, onAfter }: ScrollSpyProps) => (
  <Waypoint
    bottomOffset={-10}
    onEnter={({ previousPosition }) =>
      previousPosition === Waypoint.above && onBefore(href)
    }
    onLeave={({ currentPosition }) =>
      currentPosition === Waypoint.above && onAfter(href)
    }
    topOffset={10}
  />
);

export default ScrollSpy;
