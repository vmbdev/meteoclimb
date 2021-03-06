import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ModalWindow from '../modalwindow.js';
import helpImage from '../../images/help/help.png';
import './help.scss';

const Help = () => {
  const [modalActive, setModalActive] = useState(false);
  const intl = useIntl();

  const toggleModal = () => {
    setModalActive(!modalActive);
  }

  const closeModal = () => {
    setModalActive(false);
  }

  return (
    <div className="help">
      <div className="help__icon" onClick={ toggleModal }></div>
      <ModalWindow active={ modalActive } closeAction={ closeModal }>
        <div className="help__modal">
          <div className="modal__left">
            <img src={ helpImage } alt="Forecast example" />
          </div>

          <div className="modal__right">
            <div className="help__title">
              <FormattedMessage
                id="help.title"
                defaultMessage="How does meteoclimb work?"
                />
            </div>
            <div className="help__description">
              <p>
                <FormattedMessage
                  id="help.desc.params"
                  defaultMessage="Four parameters are observed: {temperature}, {wind}, {precipitation} and {humidity}."
                  values={{
                    temperature: <strong>{intl.formatMessage({ id: 'forecast.term.temperature', defaultMessage: 'temperature'})}</strong>,
                    wind: <strong>{intl.formatMessage({ id: 'forecast.term.wind', defaultMessage: 'wind'})}</strong>,
                    precipitation: <strong>{intl.formatMessage({ id: 'forecast.term.precipitation', defaultMessage: 'precipitation'})}</strong>,
                    humidity: <strong>{intl.formatMessage({ id: 'forecast.term.humidity', defaultMessage: 'humidity'})}</strong>,
                  }}
                />
              </p>
              <p>
                <FormattedMessage
                id="help.desc.colours"
                defaultMessage="
                  Each parameter has a colour associated to its predicted state, ranging from great (mild temperatures, little wind, no rain/snow or low humidity)
                  to terrible (too cold or hot, strong wind currents, rain or snow predicted or extreme humidity). The box containing the forecast
                  will inherit the colour of the worst situation possible (i.e. if there's rain, precipitation and the box will be red, independently
                  of the rest of the parameters).
                  "
                />
              </p>
              <p>
                <FormattedMessage
                  id="help.desc.figure"
                  defaultMessage="
                    In the figure below, temperature is bad as it's too hot, wind speed is great, precipitation is terrible as it's going to rain and
                    humidity is good. As precipitations are expected and it has the lowest quality score, the box color will be red. Also, the wind arrow points
                    to the wind direction!
                    "
                />
              </p>
            </div>
            <div className="help__legend">
              <div className="help__color help__color--great"><FormattedMessage id="forecast.status.great" defaultMessage="Great" /></div>
              <div className="help__color help__color--good"><FormattedMessage id="forecast.status.good" defaultMessage="Good" /></div>
              <div className="help__color help__color--bad"><FormattedMessage id="forecast.status.bad" defaultMessage="Bad" /></div>
              <div className="help__color help__color--terrible"><FormattedMessage id="forecast.status.terrible" defaultMessage="Terrible" /></div>
            </div>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
}

export default Help;