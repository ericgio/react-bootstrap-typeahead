import PropTypes from 'prop-types';
import React from 'react';
import {MenuItem, NavDropdown} from 'react-bootstrap';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import withBSVersion from '../util/withBSVersion';

class VersionDropdown extends React.Component {
  render() {
    const {children, isOpen, isV3, onSelect, onToggle, title} = this.props;

    return isV3 ?
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
  }
}

VersionDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isV3: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const VersionDropdownItem = ({eventKey, isV3, onClick, ...props}) => isV3 ?
  <MenuItem {...props} eventKey={eventKey} /> :
  <DropdownItem {...props} onClick={onClick} />;

const VersionDropdownWithContext = withBSVersion(VersionDropdown);
VersionDropdownWithContext.Item = withBSVersion(VersionDropdownItem);

export default VersionDropdownWithContext;
