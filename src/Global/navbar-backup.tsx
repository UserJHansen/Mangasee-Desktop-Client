import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faFolder,
  faSearch,
  faComments,
  faUser,
  faRss,
  faThumbtack,
  faCog,
  faSignOutAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Navbar as navbar, Nav, NavDropdown } from 'react-bootstrap';
import navbarcss from './navbarflex.module.scss';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <>
      <div
        className={navbarcss.container}
        style={{ backgroundColor: '#2b2b2b' }}
      >
        <NavLink to="home">
          <img src={logo} alt="Mangasee Logo" className={navbarcss.logo} />
        </NavLink>
        <div className={navbarcss.expSearchBox}>
          <div className={navbarcss.expSearchFrom}>
            <input
              id="field"
              className={navbarcss.field}
              type="text"
              placeholder="Search here"
            />
            <div className={navbarcss.close}>
              <span />
              <span className={navbarcss.back} />
            </div>
          </div>
        </div>
      </div>
      <div className={navbarcss.menubar}>
        <div className={`${navbarcss.container}`}>
          <ul>
            {[
              ['Home', faHome],
              ['Directory', faFolder],
              ['Search', faSearch],
              ['Discussion', faComments],
            ].map((object) => {
              return (
                <li key={object[0] as string}>
                  <NavLink
                    to={`/${object[0] as string}`}
                    className={navbarcss.navitem}
                    activeClassName={navbarcss.active}
                  >
                    <FontAwesomeIcon icon={object[1] as IconDefinition} />
                    <span className="d-none d-md-inline">
                      {` ${object[0] as string}`}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <ul>
            <li className={navbarcss.navitem}>
              <navbar.Toggle aria-controls="navbar-dark-example" />
              <navbar.Collapse id="navbar-dark-example">
                <Nav>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="Dropdown"
                    menuVariant="dark"
                  >
                    {[
                      ['Subscriptions', faRss],
                      ['Bookmarks', faThumbtack],
                      ['Settings', faCog],
                      ['Logout', faSignOutAlt],
                    ].map((object) => {
                      return (
                        <div
                          key={object[0] as string}
                          className="dropdown-item"
                        >
                          <NavLink
                            to={`/${object[0] as string}`}
                            activeClassName={navbarcss.active}
                          >
                            <FontAwesomeIcon
                              icon={object[1] as IconDefinition}
                            />
                            <span className="d-none d-md-inline">
                              {` ${object[0] as string}`}
                            </span>
                          </NavLink>
                        </div>
                      );
                    })}
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </navbar.Collapse>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
