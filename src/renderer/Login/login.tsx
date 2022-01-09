import { ChangeEvent, useState } from 'react';
import { Alert, FormControl, FormLabel } from 'react-bootstrap';
import { useSWRConfig } from 'swr';

import Authentication from '../APIs/Authentication';

import animations from './animations.module.scss';
import icon from '../../../assets/icon.svg';

export default function Home() {
  const store = window.ElectronStore();

  const [email, setEmail] = useState(
    typeof store.email === 'string' ? store.email : ''
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

            const result = await Authentication.attemptLogin(
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
            <FormLabel
              htmlFor="EmailInput"
              style={{
                width: '100%',
              }}
            >
              Email address:
              <FormControl
                type="email"
                id="EmailInput"
                placeholder="name@example.com"
                // eslint-disable-next-line react/jsx-no-bind
                onChange={handleEmailChange}
                value={email}
                required
              />
            </FormLabel>
          </div>
          <div className="mb-3">
            <FormLabel
              htmlFor="PasswordInput"
              style={{
                width: '100%',
              }}
            >
              Password:
              <FormControl
                type="password"
                id="PasswordInput"
                placeholder="********"
                minLength={5}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={handlePasswordChange}
                value={password}
                required
              />
            </FormLabel>
          </div>
          <button
            id="signupButton"
            type="button"
            style={{
              fontSize: '1.5vw',
            }}
            onClick={window.openMangasee}
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
