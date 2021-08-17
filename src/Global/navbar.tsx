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
              <div
                className="dropdown"
                onClick={() => {
                  const dropdowns = document.getElementsByClassName('dropdown');

                  for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].classList.toggle('show');
                  }
                  const Menus =
                    document.getElementsByClassName('dropdown-menu');

                  for (let i = 0; i < Menus.length; i += 1) {
                    Menus[i].classList.toggle('show');
                  }
                }}
                onKeyPress={() => {
                  const dropdowns = document.getElementsByClassName('dropdown');

                  for (let i = 0; i < dropdowns.length; i += 1) {
                    dropdowns[i].classList.toggle('show');
                  }
                  const Menus =
                    document.getElementsByClassName('dropdown-menu');

                  for (let i = 0; i < Menus.length; i += 1) {
                    Menus[i].classList.toggle('show');
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="d-none d-md-inline"> Account</span>
                <div className="dropdown-menu dropdown-menu-right">
                  {[
                    ['Subscriptions', faRss],
                    ['Bookmarks', faThumbtack],
                    ['Settings', faCog],
                    ['Logout', faSignOutAlt],
                  ].map((object) => {
                    return (
                      <div key={object[0] as string} className="dropdown-item">
                        <NavLink
                          to={`/${object[0] as string}`}
                          activeClassName={navbarcss.active}
                        >
                          <FontAwesomeIcon icon={object[1] as IconDefinition} />
                          <span className="d-none d-md-inline">
                            {` ${object[0] as string}`}
                          </span>
                        </NavLink>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
