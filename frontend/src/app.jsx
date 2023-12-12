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
import TempSelector from './components/navbar/temp-selector/temp-selector.jsx';
import Settings, { SettingsItem } from './components/navbar/settings-menu/settings-menu.jsx';

import settings from './settings.js';
import './layout/main.scss';
import WindSelector from './components/navbar/wind-selector/wind-selector.jsx';

function App(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [theme, setTheme] = useState(settings.theme);
  const [lang, setLang] = useState(props.defaultLang);
  const [tempUnit, setTempUnit] = useState(settings.units.temp);
  const [windUnit, setWindUnit] = useState(settings.units.wind);
  const [messages, setMessages] = useState(props.defaultMessages);

  useEffect(() => {
    loadDataFromStorage();
  }, []);

  /**
   * Reads previously used settings if they're stored in LocalStorage.
   */
  const loadDataFromStorage = () => {
    // load temperature units from localStorage
    const storedTempUnit = localStorage.getItem('METEO_tempUnit');

    if (storedTempUnit) setTempUnit(storedTempUnit);

    // load wind units from localStorage
    const storedWindUnit = localStorage.getItem('METEO_windUnit');

    if (storedWindUnit) setWindUnit(storedWindUnit);

    // load theme from localStorage
    const storedTheme = localStorage.getItem('METEO_theme');

    if (storedTheme) setTheme(storedTheme);

    // Tries to load an stored language in localStorage.
    // If there's none, then tries to load user's browser language
    const storedLang = localStorage.getItem('METEO_lang');

    if (storedLang && settings.availableTranslations.includes(storedLang)) {
      changeLang(storedLang);
    } else if (settings.availableTranslations.includes(navigator.language)) {
      changeLang(navigator.language);
    }

    // load previous searches from localstorage
    const storableResults = JSON.parse(localStorage.getItem('METEO_results'));

    setStoredData(storableResults);
  };

  const saveResultsIntoStorage = (storableResults) => {
    if (!loadingData) {
      localStorage.setItem('METEO_results', JSON.stringify(storableResults));
    }
  };

  const changeTempUnits = async (unit) => {
    setTempUnit(unit);
    localStorage.setItem('METEO_tempUnit', unit);
  }

  const changeWindUnits = async (unit) => {
    setWindUnit(unit);
    localStorage.setItem('METEO_windUnit', unit);
  }

  const changeLang = async (newLang) => {
    if (settings.availableTranslations.includes(newLang)) {
      const { default: newMessages } = await import(
        `./locales/${newLang}.json`
      );

      setLang(newLang);
      setMessages(newMessages);
      localStorage.setItem('METEO_lang', newLang);
    }
  };

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('METEO_theme', newTheme);
  };

  return (
    <IntlProvider locale={lang} messages={messages}>
      <div className={`body-wrapper theme-${theme}`}>
        <header>
          <Navbar>
            <Help />
            <Settings>
              <SettingsItem>
                <TempSelector selected={tempUnit} onChange={changeTempUnits} />
              </SettingsItem>
              <SettingsItem>
                <WindSelector selected={windUnit} onChange={changeWindUnits} />
              </SettingsItem>
              <SettingsItem>
                <LangSelector
                  changeLang={changeLang}
                  lang={lang}
                  availableTranslations={settings.availableTranslations}
                />
              </SettingsItem>
              <SettingsItem>
                <ThemeSwitcher switchTheme={switchTheme} theme={theme} />
              </SettingsItem>
            </Settings>
          </Navbar>
        </header>
        <div className="main-content">
          <Search
            storedData={storedData}
            awaitSearchResults={setSearchResults}
            setLoadingData={setLoadingData}
          />
          <Results
            saveToStorage={saveResultsIntoStorage}
            searchResults={searchResults}
            units={{ temp: tempUnit, wind: windUnit }}
          />
          <ToastContainer />
        </div>
        <Footer>
          <FormattedMessage
            id="footer.msg"
            defaultMessage="© 2022 meteoclimb - Source code at {link}"
            values={{
              link: (
                <a href="https://github.com/vmbdev/meteoclimb" target="_blank">
                  GitHub
                </a>
              ),
            }}
          />
        </Footer>
      </div>
    </IntlProvider>
  );
}

export default App;
