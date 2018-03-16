import React from 'react';
import {Checkbox, Radio} from 'react-bootstrap';
import {FormGroup, Input, Label} from 'reactstrap';

import withBSVersion from '../util/withBSVersion';

const Control = ({children, isV3, type, ...props}) => {
  const Component = type === 'radio' ? Radio : Checkbox;

  return isV3 ?
    <Component {...props}>
      {children}
    </Component> :
    <FormGroup check>
      <Label check>
        <Input {...props} type={type} />
        {' '}
        {children}
      </Label>
    </FormGroup>;
};

export default withBSVersion(Control);
