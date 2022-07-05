import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';

// Components
import Search from './components/search/search.js';
import Results from './components/results/results.js';
import Footer from './components/footer.js';
import Navbar from './components/navbar/navbar.js';
import Help from './components/navbar/help.js';
import LangSelector from './components/navbar/langselector.js';
import ThemeSwitcher from './components/navbar/themeswitcher.js';

import settings from './settings.js';
import './layout/main.scss';

function App(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [theme, setTheme] = useState(settings.theme);
  const [lang, setLang] = useState(props.defaultLang);
  const [messages, setMessages] = useState(props.defaultMessages);

  useEffect(() => {
      // load theme from localstorage
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) setTheme(storedTheme);
      
      // Tries to load an stored language in localStorage.
      // If it can't, then tries to load user's browser language
      const storedLang = localStorage.getItem('lang');
      if (storedLang && settings.availableTranslations.includes(storedLang)) changeLang(storedLang);
      else if (settings.availableTranslations.includes(navigator.language)) changeLang(navigator.language);

      // load previous searches from localstorage
      const storableResults = JSON.parse(localStorage.getItem('resultList'));
      setStoredData(storableResults);
    // });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (storableResults) => {
    if (!loadingData) localStorage.setItem('resultList', JSON.stringify(storableResults));
  }

  const awaitSearchResults = async (results) => {
    let resolvedResults = (await Promise.all(results)).flat();
    setSearchResults(resolvedResults);
  }

  const changeLang = async (newLang) => {
    if (settings.availableTranslations.includes(newLang)) {
      const { default: newMessages } = await import(`./locales/${newLang}.json`);
      setLang(newLang);
      setMessages(newMessages);
      localStorage.setItem('lang', newLang);
    }
  }

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <IntlProvider locale={ lang } messages={ messages }>
      <div className={ `body-wrapper theme-${theme}` }>
        <Navbar>
          <Help />
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
