import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

// https://codesandbox.io/s/scroll-to-top-react-component-coderomeos-forked-go3tm
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scorlled upto given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      onClick={scrollToTop}
      onKeyPress={scrollToTop}
      role="button"
      tabIndex={0}
      style={{
        position: 'fixed',
        bottom: '3em',
        right: 0,
        fontSize: 20,
        padding: '4px 10px 7px 12px',
        zIndex: 100000,
        color: '#ccc',
        backgroundColor: '#fff',
      }}
      className={isVisible ? 'fade-in' : 'fade-out'}
    >
      <FontAwesomeIcon icon={faChevronUp} />
    </div>
  );
}
