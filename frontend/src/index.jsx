import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import settings from './settings.js';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

import(`./locales/${settings.lang}.json`)
  .then(({ default: defaultMessages }) => {
    root.render(
      <App 
        defaultLang={ settings.lang }
        defaultMessages={ defaultMessages }
      />
    );
  }
);
