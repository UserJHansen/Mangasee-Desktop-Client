import React from 'react';
import { NavLink } from 'react-router-dom';
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
        <div>
          <NavLink to="/home" activeClassName={navbarcss.active}>
            <i className="fas fa-home" />
            <span className="d-none d-md-inline">Home</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
