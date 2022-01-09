import { Link } from 'react-router-dom';
import CSS from './footer.module.scss';

export default function Footer() {
  return (
    <div className={CSS.Footer}>
      <Link to="/">Home</Link>
      <div
        onClick={window.openContact}
        onKeyPress={window.openContact}
        role="link"
        tabIndex={0}
      >
        Contact
      </div>
      <div
        onClick={window.openPrivacy}
        onKeyPress={window.openPrivacy}
        role="link"
        tabIndex={0}
      >
        Privacy
      </div>
      <br />
      Copyright © MangaSee 2021
    </div>
  );
}
