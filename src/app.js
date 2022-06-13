import React, { useState, useEffect, useRef } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';

// Components
import Search from './components/search/search.js';
import Results from './components/results/results.js';
import Footer from './components/footer.js';
import Navbar from './components/navbar/navbar.js';
import LangSelector from './components/langselector.js';
import ThemeSwitcher from './components/themeswitcher.js';

import settings from './settings.js';
import defaultTranslation from './locales/default.json';
import './layout/main.scss';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [theme, setTheme] = useState(settings.theme);
  const [lang, setLang] = useState(settings.lang);
  const [messages, setMessages] = useState(defaultTranslation);
  const translations = useRef({});

  useEffect(() => {
    // FIXME: temporary; make it lazy load on request
    (async () => {
      for await (const translation of settings.availableTranslations) {
        if (translation !== settings.lang) {
          const { default: content } = await import(`./locales/${translation}.json`)
          translations.current[translation] = content;
        }
      }
    })();
    translations.current[lang] = defaultTranslation;

    // load theme from localstorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);

    // load previous searches from localstorage
    const storableResults = JSON.parse(localStorage.getItem('resultList'));
    setStoredData(storableResults);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (storableResults) => {
    if (!loadingData) localStorage.setItem('resultList', JSON.stringify(storableResults));
  }

  const awaitSearchResults = async (results) => {
    let resolvedResults = (await Promise.all(results)).flat();
    setSearchResults(resolvedResults);
  }

  const changeLang = (lang) => {
    setLang(lang);
    setMessages(translations.current[lang]);
  }

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }

  return (
    <IntlProvider locale={ lang } messages={ messages }>
      <div className={ `body-wrapper theme-${theme}` }>
        <Navbar>
          <LangSelector
            changeLang={ changeLang }
            lang={ lang }
            availableTranslations={ settings.availableTranslations }
          />
          <ThemeSwitcher switchTheme={ switchTheme } theme={ theme } />
        </Navbar>
        <div className="main-content">
          <Search
            storedData={ storedData }
            awaitSearchResults={ awaitSearchResults }
            setLoadingData={ setLoadingData }
            endpoint={ settings.endpoint }
          />
          <Results save={ save } searchResults={ searchResults } />
        </div>
        <Footer>
          <FormattedMessage
            id="footer.msg"
            defaultMessage="© 2022 meteoclimb - Source code at {link}"
            values={{
              link: <a href="https://github.com/vmbdev/meteoclimb" rel="noreferrer" target="_blank">GitHub</a>
            }}
          />
        </Footer>
      </div>
    </IntlProvider>
  );
}

export default App;
