import React, { useEffect, useRef } from 'react';

const LanguageSelector = () => {
  const scriptLoaded = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || initialized.current) {
      return;
    }

    const addGoogleTranslateScript = () => {
      scriptLoaded.current = true;
      const script = document.createElement('script');
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = () => {
        if (window.google && !initialized.current) {
          window.googleTranslateElementInit();
          initialized.current = true;
        }
      };
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          includedLanguages: 'en,hi,mr,fr,es', // Limit to your supported languages
        },
        'google_translate_element'
      );
    };

    if (!window.google || !window.google.translate) {
      addGoogleTranslateScript();
    }
  }, []);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    const languageDropdown = document.querySelector(".goog-te-combo");
    if (languageDropdown) {
      languageDropdown.value = selectedLanguage;
      languageDropdown.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="language-selector">
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <select onChange={handleLanguageChange} className="custom-language-select">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
};

export default LanguageSelector;