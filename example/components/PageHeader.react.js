import * as React from 'react';
import {Collapse, Nav, Navbar, NavItem, NavLink, NavbarBrand, NavbarToggler} from 'reactstrap';

import {version} from '../../package.json';

const GITHUB_URL = 'https://github.com/ericgio/react-bootstrap-typeahead';

class PageHeader extends React.Component {
  // const PageHeader = () => (
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      // className="bs-docs-nav navbar-toggleable-sm"
      <Navbar color="inverse" dark expand>
        <NavbarToggler onClick={this.toggle} />
        <NavbarBrand>
          React Bootstrap Typeahead
        </NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href={`${GITHUB_URL}/releases`} target="_blank">
                v{version}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={GITHUB_URL} target="_blank">
                Github
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default PageHeader;
