import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faComments,
  faFolder,
  faRss,
  faThumbtack,
  faCog,
  faSignOutAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
  Row,
  Col,
  InputGroup,
  FormControl,
} from 'react-bootstrap';

import Authentication from '../APIs/Authentication';

import CSS from './navbarflex.module.scss';

function quickSearch() {}

function quickSearchSubmit() {}

export default function Navbar() {
  return (
    <>
      <BSNavbar
        style={{ backgroundColor: '#2b2b2b' }}
        expand="lg"
        variant="dark"
      >
        <Container>
          <Row className="align-items-center" style={{ width: 'inherit' }}>
            <Col lg={8} md={7} className="mx-auto">
              <Link to="/home">
                <img
                  alt="Mangasee Logo"
                  src="https://mangasee123.com/media/navbar.brand.png"
                  className="d-inline-block"
                />
              </Link>
            </Col>
            <Col lg={4} md={5} className={`mx-auto ${CSS.QuickSearch}`}>
              <InputGroup className="mx-auto">
                <FormControl
                  type="text"
                  placeholder="Quick Search..."
                  onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') quickSearchSubmit();
                    else quickSearch();

                    event.preventDefault();
                  }}
                />
                <InputGroup.Text onClick={quickSearchSubmit}>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </BSNavbar>
      <BSNavbar
        style={{ backgroundColor: '#444', top: -1 }}
        variant="dark"
        collapseOnSelect
        expand="lg"
        sticky="top"
        id="SmallerNav"
      >
        <Container>
          <BSNavbar.Toggle
            aria-controls="bottom-nav"
            className="justify-content-end"
          />
          <BSNavbar.Collapse id="bottom-nav">
            {[
              ['Home', faHome],
              ['Directory', faFolder],
              ['Search', faSearch],
              ['Discussion', faComments],
            ].map((object) => {
              return (
                <NavLink
                  to={`/${object[0] as string}`}
                  className={CSS.navitem}
                  activeClassName={CSS.active}
                  key={object[0] as string}
                >
                  <FontAwesomeIcon icon={object[1] as IconDefinition} />
                  {` ${object[0] as string}`}
                </NavLink>
              );
            })}
          </BSNavbar.Collapse>
          <Nav className="justify-content-end">
            <NavDropdown title="Account" id="account-dropdown">
              {[
                ['Subscriptions', faRss],
                ['Bookmarks', faThumbtack],
                ['Settings', faCog],
              ].map((object) => {
                return (
                  <NavLink
                    to={`/${object[0] as string}`}
                    activeClassName={CSS.active}
                    key={object[0] as string}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={object[1] as IconDefinition} />
                    {` ${object[0] as string}`}
                  </NavLink>
                );
              })}
              <NavDropdown.Item onClick={Authentication.logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {' Logout'}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </BSNavbar>
    </>
  );
}
