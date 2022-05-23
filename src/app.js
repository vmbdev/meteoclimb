import React, { useState } from 'react';
import Search from './components/search/search.js';
import Results from './components/results/results.js';

function App() {
  const [results, setResults] = useState([]);

  const getResults = (results) => {
    if (results) setResults(results);
  }

  return (
    <>
      <Search getResults={ getResults } />
      <Results results={ results } />
    </>
  );
}

export default App;
