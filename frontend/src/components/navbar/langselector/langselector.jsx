/**
 * @module LangSelector
 */
import React, { useState, useEffect } from 'react';
import { getLanguageData } from '../../../helpers/countrycodes.js';
import './langselector.scss';

/**
 * JSX Component representing the language selector.
 * @param {Object} props
 * @param {string} props.lang  Locale representing a language.
 * @param {string[]} props.availableTranslations  List of avaliable languages.
 * @param {Function} props.changeLang  Function called when the locale changes.
 * @returns The rendered JSX Component.
 */
const LangSelector = ({ lang, availableTranslations, changeLang }) => {
  const [currentLang, setCurrentLang] = useState({ name:'', flag:'' });
  const [active, setActive] = useState(false);

  useEffect(() => {
    setCurrentLang(getLanguageData(lang));
  }, [lang])

  const showLanguageList = () => {
    setActive(active ? false : true);
  }

  const showSelector = () => {
    return `langselector__list--${active ? 'visible' : 'hidden'}`;
  }

  const capitalise = (text) => {
    return text[0].toUpperCase() + text.slice(1);
  }
  
  return (
    <div className="langselector">
      <div className="langselector__selection" onClick={ showLanguageList }>
        <img
          className="langselector__flag"
          src={ currentLang.flag }
          alt={ currentLang.langDesc }
        />
      </div>
      <div className={ `langselector__list ${showSelector()}` }>
        { availableTranslations.map(translation => {
          const t = getLanguageData(translation);

          return (
            <div
              key={ t.locale }
              className="langselector__translation"
              onClick={ () => { changeLang(t.locale) } }
            >
              <img src={ t.flag } alt={ t.langDesc } />
              { capitalise(t.langDesc) }
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default LangSelector;