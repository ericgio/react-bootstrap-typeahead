/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Waypoint } from 'react-waypoint';

const ScrollSpy = ({ href, onBefore, onAfter }) => (
  <Waypoint
    bottomOffset={-10}
    onEnter={({ previousPosition }) => (
      previousPosition === Waypoint.above && onBefore(href)
    )}
    onLeave={({ currentPosition }) => (
      currentPosition === Waypoint.above && onAfter(href)
    )}
    topOffset={10}
  />
);

export default ScrollSpy;
