/* eslint-disable import/no-extraneous-dependencies */

import PropTypes from 'prop-types';
import React from 'react';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { withContext } from './Context.react';

const VersionDropdown = (props) => {
  const { children, isBS3, isOpen, onSelect, onToggle, title } = props;

  return isBS3 ?
    <NavDropdown id="bs-version-selector" onSelect={onSelect} title={title}>
      {children}
    </NavDropdown> :
    <Dropdown inNavbar isOpen={isOpen} nav toggle={onToggle}>
      <DropdownToggle caret nav>
        {title}
      </DropdownToggle>
      <DropdownMenu right>
        {children}
      </DropdownMenu>
    </Dropdown>;
};

VersionDropdown.propTypes = {
  isBS3: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const VersionDropdownItem = ({ eventKey, isBS3, onClick, ...props }) => (
  isBS3 ?
    <MenuItem {...props} eventKey={eventKey} /> :
    <DropdownItem {...props} onClick={onClick} />
);

const VersionDropdownWithContext = withContext(VersionDropdown, ['isBS3']);
VersionDropdownWithContext.Item = withContext(VersionDropdownItem, ['isBS3']);

export default VersionDropdownWithContext;
