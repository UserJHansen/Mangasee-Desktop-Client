import React from 'react';

export default function Home() {
  document.getElementsByTagName('html')[0].classList.add('spin');
  document.getElementsByTagName('body')[0].classList.add('spinrev');
  return (
    <>
      <div className="mb-3">
        <label htmlFor="EmailInput" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="EmailInput"
          placeholder="name@example.com"
        />
      </div>
    </>
  );
}
