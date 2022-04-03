import React from 'react';

import Anchor from './Anchor';

import getIdFromTitle from '../util/getIdFromTitle';

interface TitleProps {
  children: string;
}

const Title = ({ children }: TitleProps) => (
  <h2>
    <Anchor id={getIdFromTitle(children)}>{children}</Anchor>
  </h2>
);

export default Title;
