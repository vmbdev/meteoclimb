import React, { useState, useEffect } from 'react';
import Search from './components/search/search.js';
import Results from './components/results/results.js';
import Footer from './components/footer.js';
import Navbar from './components/navbar/navbar.js';
import LangSelector from './components/langselector.js';
import ThemeSwitcher from './components/themeswitcher.js';
import config, { ConfigContext } from './config.js';
import './layout/main.scss';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [theme, setTheme] = useState(config.theme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);

    const storableResults = JSON.parse(localStorage.getItem('resultList'));
    setStoredData(storableResults);
  }, []);

  const save = (storableResults) => {
    if (!loadingData) localStorage.setItem('resultList', JSON.stringify(storableResults));
  }

  const awaitSearchResults = async (results) => {
    let resolvedResults = (await Promise.all(results)).flat();
    setSearchResults(resolvedResults);
  }

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }

  return (
    <ConfigContext.Provider value={ config }>
      <div className={ `body-wrapper theme-${theme}` }>
        <Navbar>
          {/* <LangSelector /> */}
          <ThemeSwitcher switchTheme={ switchTheme } theme={ theme } />
        </Navbar>
        <div className="main-content">
          <Search
            storedData={ storedData }
            awaitSearchResults={ awaitSearchResults }
            setLoadingData={ setLoadingData } />
          <Results save={ save } searchResults={ searchResults } />
        </div>
        <Footer>
          © 2022 meteoclimb - Source code at <a href="https://github.com/vmbdev/meteoclimb" rel="noreferrer" target="_blank">GitHub</a>
        </Footer>
      </div>
    </ConfigContext.Provider>
  );
}

export default App;
