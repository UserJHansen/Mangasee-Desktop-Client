import React from 'react';
import navbarcss from './navbarflex.module.scss';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <div className={navbarcss.container}>
      <img src={logo} alt="Mangasee Logo" style={{ margin: 'auto' }} />
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
  );
}
