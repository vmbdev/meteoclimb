import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getLanguageData } from '../../../helpers/countrycodes.js';
import ButtonGroup from '../../button-group/button-group.jsx';

/**
 * JSX Component representing the language selector.
 * @param {Object} props
 * @param {string} props.lang Current language in use.
 * @param {string[]} props.availableTranslations List of avaliable languages.
 * @param {Function} props.changeLang Function called when the locale changes.
 * @returns The rendered JSX Component.
 */
const LangSelector = ({ lang, availableTranslations, changeLang }) => {
  const [buttons, setButtons] = useState([]);
  const [currentLang, setCurrentLang] = useState();

  useEffect(() => {
    const bts = availableTranslations.map((translation) => {
      const languageData = getLanguageData(translation);
      return {
        icon: languageData.flag,
        text: capitalise(languageData.langDesc),
        val: languageData.locale,
      };
    });

    setButtons(bts);
  }, [availableTranslations]);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  const capitalise = (text) => {
    return text[0].toUpperCase() + text.slice(1);
  };

  return (
    <ButtonGroup
      selected={currentLang}
      onChange={changeLang}
      buttons={buttons}
      showText={false}
    />
  );
};

LangSelector.propTypes = {
  lang: PropTypes.string.isRequired,
  availableTranslations: PropTypes.array,
  changeLang: PropTypes.func,
}

export default LangSelector;
