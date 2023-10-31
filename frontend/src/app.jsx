/**
 * @module App
 */
import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// Components
import Search from './components/search/search.jsx';
import Results from './components/results/results.jsx';
import Footer from './components/footer/footer.jsx';
import Navbar from './components/navbar/navbar.jsx';
import Help from './components/navbar/help/help.jsx';
import LangSelector from './components/navbar/lang-selector/lang-selector.jsx';
import ThemeSwitcher from './components/navbar/theme-switcher/theme-switcher.jsx';

import { toaster } from './services/toaster.js';

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
    const storedTheme = localStorage.getItem('METEO_theme');

    if (storedTheme) setTheme(storedTheme);
    
    // Tries to load an stored language in localStorage.
    // If there's none, then tries to load user's browser language
    const storedLang = localStorage.getItem('METEO_lang');

    if (storedLang && settings.availableTranslations.includes(storedLang)) {
      changeLang(storedLang);
    }
    else if (settings.availableTranslations.includes(navigator.language)) {
      changeLang(navigator.language);
    }

    // load previous searches from localstorage
    const storableResults =
      JSON.parse(localStorage.getItem('METEO_resultList'));

    setStoredData(storableResults);
  }, []);

  useEffect(() => {
    toaster.setTheme(theme);
  }, [theme])

  const saveIntoLocalStorage = (storableResults) => {
    if (!loadingData) {
      localStorage.setItem('METEO_resultList', JSON.stringify(storableResults));
    }
  }

  const awaitSearchResults = async (results) => {
    try {
      const resolveProms = await Promise.allSettled(results);

      const validResults = resolveProms
        .filter((res) => res.status === 'fulfilled')
        .map((res) => res.value)
        .flat();

      setSearchResults(validResults);
    } catch (err) {
      toaster.error('Error fetching forecast.', 'forecast-error')
    }
  }

  const changeLang = async (newLang) => {
    if (settings.availableTranslations.includes(newLang)) {
      const { default: newMessages } =
        await import(`./locales/${newLang}.json`);

      setLang(newLang);
      setMessages(newMessages);
      localStorage.setItem('METEO_lang', newLang);
    }
  }

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('METEO_theme', newTheme);
  }

  return (
    <IntlProvider locale={ lang } messages={ messages }>
      <div className={ `body-wrapper theme-${theme}` }>
        <header>
          <Navbar>
            <Help />
            <LangSelector
              changeLang={ changeLang }
              lang={ lang }
              availableTranslations={ settings.availableTranslations }
            />
            <ThemeSwitcher switchTheme={ switchTheme } theme={ theme } />
          </Navbar>
        </header>
        <div className="main-content">
          <Search
            storedData={ storedData }
            awaitSearchResults={ awaitSearchResults }
            setLoadingData={ setLoadingData }
          />
          <Results
            save={ saveIntoLocalStorage }
            searchResults={ searchResults }
          />
           <ToastContainer />
        </div>
        <Footer>
          <FormattedMessage
            id="footer.msg"
            defaultMessage="© 2022 meteoclimb - Source code at {link}"
            values={{
              link:
                <a
                  href="https://github.com/vmbdev/meteoclimb"
                  target="_blank"
                >
                  GitHub
                </a>
            }}
          />
        </Footer>
      </div>
    </IntlProvider>
  );
}

export default App;
