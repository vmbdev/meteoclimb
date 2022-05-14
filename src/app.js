import React, { useEffect, useState } from 'react'
import Area from './components/search/area.js';
import Results from './components/results.js';

function App() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions([
      { id: 5, city: "Madrid, España" },
      { id: 12, city: "London, United Kingdom" },
      { id: 25, city: "Osaka, Japan" }
    ]);
  }, []);


  return (
    <div>
      <Area suggestions={ suggestions } />
      <Results />
    </div>
  );
}

export default App;
