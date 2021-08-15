import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import navbarcss from './navbarflex.module.scss';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <>
      <div className={navbarcss.container}>
        <img src={logo} alt="Mangasee Logo" className={navbarcss.logo} />
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
        <div className={navbarcss.container}>
          <NavLink
            to="/home"
            className={navbarcss.navitem}
            activeClassName={navbarcss.active}
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="d-md-inline">Home</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
