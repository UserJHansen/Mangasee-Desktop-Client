import React, { ChangeEvent, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { shell } from 'electron';
import Authentication from './Authentication';
import Store from '../APIs/storage';
import animations from './animations.module.scss';

import icon from '../../assets/icon.svg';

export default function Home(props: {
  onLogin: (unknown | (() => Promise<void>))[];
}) {
  const authentication = new Authentication();
  const store = new Store();

  document.getElementsByTagName('html')[0].classList.add(animations.spin);
  document
    .getElementsByTagName('body')[0]
    .classList.add(animations.spinReverse);

  const [email, setEmail] = useState(
    typeof store.get('email') === 'string' ? (store.get('email') as string) : ''
  );
  const [password, setPassword] = useState('');
  const [shouldShowAlert, setShouldShowAlert] = useState(false);
  const [AlertText, setAlertText] = useState('');

  const showAlert = (text: string) => {
    setAlertText(text);
    setShouldShowAlert(true);
    setTimeout(() => {
      setShouldShowAlert(false);
    }, 10000);
  };

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value || '');
  }

  return (
    <>
      <Alert
        show={shouldShowAlert}
        variant="danger"
        onClose={() => {
          setShouldShowAlert(false);
        }}
        className="position-absolute top-0 end-0 m-3"
        dismissible
      >
        {AlertText}
      </Alert>
      <div className="box centered">
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const result = await authentication.attemptLogin(email, password);

            if (result !== true) {
              showAlert(result);
            } else {
              document
                .getElementsByTagName('html')[0]
                .classList.remove(animations.spin);
              document
                .getElementsByTagName('body')[0]
                .classList.remove(animations.spinReverse);
              if (
                props.onLogin[0] &&
                props.onLogin[1] &&
                typeof props.onLogin[1] === 'function'
              )
                props.onLogin[1](props.onLogin[0]);
            }
          }}
        >
          <img
            src={icon}
            alt="Mangasee Icon"
            style={{
              width: '50%',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingBottom: 15,
            }}
          />
          <div className="mb-3">
            <label htmlFor="EmailInput" className="form-label">
              Email address:
            </label>
            <input
              type="email"
              className="form-control"
              id="EmailInput"
              placeholder="name@example.com"
              onChange={handleEmailChange}
              value={email}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="PasswordInput" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="PasswordInput"
              placeholder="********"
              minLength={5}
              onChange={handlePasswordChange}
              value={password}
              required
            />
          </div>
          <button
            id="signupButton"
            type="button"
            style={{
              fontSize: '1.5vw',
            }}
            onClick={() => {
              shell.openExternal('https://mangasee123.com/');
            }}
            className="btn btn-warning"
          >
            Signup
          </button>
          <button
            id="LoginButton"
            type="submit"
            style={{
              float: 'right',
              fontSize: '1.5vw',
            }}
            className="btn btn-success"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
