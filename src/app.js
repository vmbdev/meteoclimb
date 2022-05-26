import React, { useState, useEffect } from 'react';
import Search from './components/search/search.js';
import Results from './components/results/results.js';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const storableResults = JSON.parse(localStorage.getItem('resultList'));
    setStoredData(storableResults);
  }, []);

  const save = (storableResults) => {
    if (!loadingData)
      localStorage.setItem('resultList', JSON.stringify(storableResults));
  }

  const awaitSearchResults = async (results) => {
    let r = (await Promise.all(results)).flat();
    setSearchResults(r);
  }

  return (
    <>
      <Search
        storedData={ storedData }
        awaitSearchResults={ awaitSearchResults }
        setLoadingData={ setLoadingData } />
      <Results save={ save } searchResults={ searchResults } />
    </>
  );
}

export default App;
