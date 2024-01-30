import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import ModalWindow from '../modal-window/modal-window.jsx';
import WeatherCard from '../weather-card/weather-card.jsx';
import { convertTemperature, convertWind } from '../../helpers/converters.js';
import './help.scss';

/**
 * JSX Component displaying the information about the usage of meteoclimb.
 * @returns The rendered JSX Component.
 */
const Help = ({ units }) => {
  const [modalActive, setModalActive] = useState(false);
  const intl = useIntl();

  const toggleModal = () => {
    setModalActive(!modalActive);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  return (
    <>
      <article className="help__icon" onClick={toggleModal} />

      <ModalWindow active={modalActive} closeAction={closeModal}>
        <div className="help__modal">
          <div className="modal__left">
            <WeatherCard
              date="2002-07-15"
              city={{
                country: 'ES',
                name: 'Madrid',
              }}
              conditions={{
                sunrise: 1706340904,
                sunset: 1706377531,
                humidity: 54,
                temp: { max: 18, feel: 18 },
                wind: { speed: 22, degrees: 121 },
                pop: { chance: 0.23, from: 1706340904, rain: 14, snow: 0 },
                start_time: 1706356800,
                weather: { id: 500, name: 'rain' },
                aqi: 4,
              }}
              units={units}
            />
          </div>

          <section className="modal__right">
            <h1 className="help__title">
              <FormattedMessage
                id="help.title"
                defaultMessage="How does meteoclimb work?"
              />
            </h1>
            <article className="help__description">
              <p>
                <FormattedMessage
                  id="help.desc.params"
                  defaultMessage="
                    Five parameters are observed: {temperature}, {wind},
                    {precipitation}, {humidity} and {pollution}.
                  "
                  values={{
                    temperature: (
                      <strong>
                        {intl.formatMessage({
                          id: 'forecast.term.temperature',
                          defaultMessage: 'Temperature',
                        })}
                      </strong>
                    ),
                    wind: (
                      <strong>
                        {intl.formatMessage({
                          id: 'forecast.term.wind',
                          defaultMessage: 'Wind',
                        })}
                      </strong>
                    ),
                    precipitation: (
                      <strong>
                        {intl.formatMessage({
                          id: 'forecast.term.precipitation',
                          defaultMessage: 'Precipitation',
                        })}
                      </strong>
                    ),
                    humidity: (
                      <strong>
                        {intl.formatMessage({
                          id: 'forecast.term.humidity',
                          defaultMessage: 'Humidity',
                        })}
                      </strong>
                    ),
                    pollution: (
                      <strong>
                        {intl.formatMessage({
                          id: 'forecast.term.pollution',
                          defaultMessage: 'Pollution',
                        })}
                      </strong>
                    ),
                  }}
                />
              </p>

              <p>
                <FormattedMessage
                  id="help.cardDesc"
                  defaultMessage="The figure here representing several colorful parameters of a given day in a given place is a {weathercard}."
                  values={{
                    weathercard: (
                      <b>
                        <FormattedMessage
                          id="help.card"
                          defaultMessage="Weather Card"
                        />
                      </b>
                    ),
                  }}
                />
              </p>
              <ol className="help__legend">
                <li className="help__color help__color--great">
                  <FormattedMessage
                    id="help.temperature"
                    defaultMessage="Temperature of {temperature}º is not too hot, and not cold at all."
                    values={{
                      temperature: convertTemperature(18, units.temp),
                    }}
                  />
                  <b>
                    <FormattedMessage
                      id="help.green"
                      defaultMessage="Green means great."
                    />
                  </b>
                </li>
                <li className="help__color help__color--bad">
                  <FormattedMessage
                    id="help.wind"
                    defaultMessage="It's quite windy, with {wind}. It can be annoying when going outdoors if we're not protected."
                    values={{
                      wind: `${convertWind(22, units.wind)} ${units.wind}`,
                    }}
                  />
                  <b>
                    <FormattedMessage
                      id="help.purple"
                      defaultMessage="Purple means bad."
                    />
                  </b>
                </li>
                <li className="help__color help__color--terrible">
                  <FormattedMessage
                    id="help.pop"
                    defaultMessage="It's going to rain. Any kind of precipitation (rain or snow) can ruin your climbing day."
                  />
                  <b>
                    <FormattedMessage
                      id="help.red"
                      defaultMessage="Red means terrible."
                    />
                  </b>
                </li>
                <li className="help__color help__color--good">
                  <FormattedMessage
                    id="help.humidity"
                    defaultMessage="Humidity is decent at 52%. You won't sweat too much."
                  />
                  <b>
                    <FormattedMessage
                      id="help.blue"
                      defaultMessage="Blue means good."
                    />
                  </b>
                </li>
                <li className="help__color help__color--terrible">
                  <FormattedMessage
                    id="help.pollution"
                    defaultMessage="Air quality is poor, so it's red. It won't be too much conditioning when climbing but we don't go outside to breathe pollution, do we? This is the only property that can be black, when te highest level is reached."
                  />
                </li>
              </ol>

              <p>
                <FormattedMessage
                  id="help.background"
                  defaultMessage="The weather card will get the background color of the parameter with the worst score. In this case, worst scenario would be rain, so the card will be red."
                />
              </p>
              <p>
                <FormattedMessage
                  id="help.compare"
                  defaultMessage="Ideally you should check for several places and compare, according to your preferences, which one offers the best weather possible to enjoy your trip as much as possible."
                />
              </p>
            </article>
          </section>
        </div>
      </ModalWindow>
    </>
  );
};

Help.propTypes = {
  units: PropTypes.object.isRequired,
}

export default Help;
