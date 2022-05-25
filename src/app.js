import React, { useState, useEffect } from 'react';
import Search from './components/search/search.js';
import Results from './components/results/results.js';

function App() {
  const [results, setResults] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const storableResults = JSON.parse(localStorage.getItem('resultList'));
    console.log('loaded ', storableResults);
    setStoredData(storableResults);    
  }, []);

  const save = (storableResults) => {
    if (!loadingData)
      localStorage.setItem('resultList', JSON.stringify(storableResults));
  }

  return (
    <>
      <Search storedData={ storedData } setResults={ setResults } setLoadingData={ setLoadingData } />
      <Results save={ save } results={ results } />
    </>
  );
}

export default App;
