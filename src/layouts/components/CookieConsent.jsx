// src/components/CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import 'src/styles/CookieConsent.css'; // Import CSS if you prefer external styling

const CookieConsent = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
      setCookiesAccepted(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  if (cookiesAccepted) return null;

  return (
    <div className="cookie-consent" id="cookie-consent">
      <span>We use cookies to ensure you get the best experience on our website.</span>
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
};

export default CookieConsent;
