import React from 'react';
import { NavLink } from 'react-router-dom';
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
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
  Row,
  Col,
} from 'react-bootstrap';

import Authentication from '../APIs/Authentication';

import CSS from './navbarflex.module.scss';

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
              <BSNavbar.Brand href="#/home">
                <img
                  alt="Mangasee Logo"
                  src="https://mangasee123.com/media/navbar.brand.png"
                  className="d-inline-block align-top"
                />
              </BSNavbar.Brand>
            </Col>
            <Col lg={4} md={5} className="mx-auto">
              <div className={CSS.expSearchBox}>
                <div className={CSS.expSearchFrom}>
                  <input
                    id="field"
                    className={CSS.field}
                    type="text"
                    placeholder="Search here"
                  />
                  <div className={CSS.close}>
                    <FontAwesomeIcon icon={faSearch} />
                    <span />
                    <span className={CSS.back} />
                  </div>
                </div>
              </div>
              <div className={CSS.SearchResult}>
                <div className={CSS.SearchResultCover}>
                  <div className={CSS.NoResults}>
                    <FontAwesomeIcon icon={faSpinner} spin /> Searching...
                  </div>
                </div>
              </div>
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
