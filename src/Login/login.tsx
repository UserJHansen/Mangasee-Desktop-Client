import React, { ChangeEvent, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { shell } from 'electron';
import { useSWRConfig } from 'swr';

import Authentication from '../APIs/Authentication';
import Store from '../APIs/storage';
import animations from './animations.module.scss';

import icon from '../../assets/icon.svg';

export default function Home() {
  const authentication = new Authentication();
  const store = new Store();

  const [email, setEmail] = useState(
    typeof store.get('email') === 'string' ? (store.get('email') as string) : ''
  );
  const [password, setPassword] = useState('');
  const [shouldShowAlert, setShouldShowAlert] = useState(false);
  const [AlertText, setAlertText] = useState('');

  const { mutate } = useSWRConfig();

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
    <div className={animations.spin}>
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
      <div className="box">
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const result = await authentication.attemptLogin(
              email,
              password,
              mutate
            );

            if (result !== true) {
              showAlert(result);
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
            <label
              htmlFor="EmailInput"
              className="form-label"
              style={{
                width: '100%',
              }}
            >
              Email address:
              <input
                type="email"
                className="form-control"
                id="EmailInput"
                placeholder="name@example.com"
                onChange={handleEmailChange}
                value={email}
                required
              />
            </label>
          </div>
          <div className="mb-3">
            <label
              htmlFor="PasswordInput"
              className="form-label"
              style={{
                width: '100%',
              }}
            >
              Password:
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
            </label>
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
    </div>
  );
}
