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
import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
} from 'react-bootstrap';

import navbarcss from './navbarflex.module.scss';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <>
      <BSNavbar style={{ backgroundColor: '#2b2b2b' }} variant="dark">
        <Container>
          <BSNavbar.Brand href="#/home">
            <img
              alt="Mangasee Logo"
              src={logo}
              className="d-inline-block align-top"
            />
          </BSNavbar.Brand>

          <BSNavbar.Text id="top-navbar" className="justify-content-end">
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
          </BSNavbar.Text>
        </Container>
      </BSNavbar>
      <BSNavbar
        style={{ backgroundColor: '#444' }}
        variant="dark"
        collapseOnSelect
        expand="lg"
        sticky="top"
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
                  className={navbarcss.navitem}
                  activeClassName={navbarcss.active}
                  key={object[0] as string}
                >
                  <FontAwesomeIcon icon={object[1] as IconDefinition} />
                  {` ${object[0] as string}`}
                </NavLink>
              );
            })}
          </BSNavbar.Collapse>
          <Nav className="justify-content-end">
            <NavDropdown
              title="Account"
              id="account-dropdown"
              menuVariant="dark"
            >
              {[
                ['Subscriptions', faRss],
                ['Bookmarks', faThumbtack],
                ['Settings', faCog],
                ['Logout', faSignOutAlt],
              ].map((object) => {
                return (
                  <NavDropdown.Item
                    key={object[0] as string}
                    href={`#/${object[0] as string}`}
                  >
                    <FontAwesomeIcon icon={object[1] as IconDefinition} />
                    {` ${object[0] as string}`}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
          </Nav>
        </Container>
      </BSNavbar>
    </>
  );
}

// [
//   ['Home', faHome],
//   ['Directory', faFolder],
//   ['Search', faSearch],
//   ['Discussion', faComments],
// ].map((object) => {
//   return (
//     <li key={object[0] as string}>
//       <NavLink
//         to={`/${object[0] as string}`}
//         className={navbarcss.navitem}
//         activeClassName={navbarcss.active}
//       >
//         <FontAwesomeIcon icon={object[1] as IconDefinition} />
//         <span className="d-none d-md-inline">{` ${object[0] as string}`}</span>
//       </NavLink>
//     </li>
//   );
// });

// [
//   ['Subscriptions', faRss],
//   ['Bookmarks', faThumbtack],
//   ['Settings', faCog],
//   ['Logout', faSignOutAlt],
// ].map((object) => {
//   return (
//     <div key={object[0] as string} className="dropdown-item">
//       <NavLink
//         to={`/${object[0] as string}`}
//         activeClassName={navbarcss.active}
//       >
//         <FontAwesomeIcon icon={object[1] as IconDefinition} />
//         <span className="d-none d-md-inline">{` ${object[0] as string}`}</span>
//       </NavLink>
//     </div>
//   );
// });
