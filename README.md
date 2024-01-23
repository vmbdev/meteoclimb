# meteoclimb

![meteoclimb](https://raw.githubusercontent.com/vmbdev/meteoclimb/main/frontend/public/ogmeteoclimb.png)

**meteoclimb** is a React/Node.js application to visualize the forecast for
outdoors activities (mainly focused on rock climbing).

You can access the live app on [https://meteoclimb.hippolyta.xyz](https://meteoclimb.hippolyta.xyz).

meteoclimb contains both a server (running on ExpressJS) and a front-end (made
with React).

## Prerequisites

meteoclimb requires [Node.js](https://nodejs.org/) 18 or later installed on
your system.

## User Interface

The UI is made with React, FormatJS (React Intl) and SASS.

### Setup

In the first run, you'll need to compile the language files into locales that
the application can use. Using FormatJS'
[React intl](https://formatjs.io/docs/react-intl/), you can do it with the
following command:

```bash
npm run formatjs:compile-all
```

Once the translations are available, you can build the React application using
the following command.

```bash
npm run ui:build
```

Or if you prefer to run the app as a development server:

```bash
npm run ui:start
```

The app runs with [Vite](https://vitejs.dev/guide/cli.html), so you can tweak
the parameters as you need.

The resulting build will be available in the **/frontend/build** directory.
The backend server will automatically detect it at the start and serve it in
the root URL.

### Settings

We can tweak our interface through the **/frontend/src/settings.js** file.

```js
const settings = {
  endpoint:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'http://localhost:5005/api',
  lang: 'en',
  availableTranslations: ['es', 'en'],
  units: {
    temp: 'celsius',
    wind: 'km/h',
  },
  theme: 'light',
};

export default settings;
```

- **settings.endpoint**: The endpoint for making API calls.
- **settings.lang**: The default language.
- **settings.availableTranslations**: Array of strings containing the
translations that are available for the language selector. Files must be in the
**frontend/src/locales** location already compiled (use the FormatJS commands
described above).
- **settings.units**: The default units usead for measurement.
  - **settings.units.temp**: 'fahrenheit' or 'celsius'.
  - **settings.units.wind**: 'km/h', 'mph', 'm/s', 'ft/s' or 'knots'.
- **settings.units.theme**: Default theme. 'light' or 'dark'.

## Backend Server

The backend runs on Express 4 and uses Sequelize for connecting to the
database.

### Setup

First of all, you'll need an OpenWeather API key (currently the only provider
available). You can get one from [here](https://openweathermap.org/appid).

Rename /backend/config/**meteo.config.example.js** to
/backend/config/**meteo.config.js**, and edit it to match your set up. For example:

```javascript
import databaseConfig from './database.json' assert { type: "json" };

export const config = {
  server: {
    // if changed, remember to update it in frontend/src/config.js
    port: 5005,
    enable_cors: true,
    cors_origin: 'http://localhost:5173'
  },

  database: process.env.NODE_ENV === 'production' ?
    databaseConfig.production :
    databaseConfig.development,

  weather: {
    provider: 'OpenWeather',
    apikey: '',
    units: 'metric' //standard, metric and imperial
  }
}
```

Don't touch the **database** part; instead, rename
**/backend/config/database.example.json** to **/backend/config/database.json**
and edit your database information there. For example:

```json
{
  "development": {
    "database": "meteoclimb",
    "username": "meteoclimb",
    "password": "password",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "database": "meteoclimb",
    "username": "meteoclimb",
    "password": "password",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "database": "meteoclimb",
    "username": "meteoclimb",
    "password": "password",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

Once our database parameters are set, we'll need to build it. At the moment,
only PostgreSQL is supported, though more are planned in future updates.
To create the tables, run:

```bash
npm run db:migrate
```

Now we need to fullfill the database with the list of supported locations. For
this, we'll need the city list from OpenWeather
[here](https://bulk.openweathermap.org/sample/). Both city.list.json and
city.list.min.json are valid. Save it on the root of the project and run:

```bash
npm run db:seed
```

Now that the database is ready, we can start the server with the following
command:

```bash
npm run server:start
```

If you plan to make changes on the code, run it in watch mode:

```bash
npm run server:start:watch
```

## Built with

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [Ky](https://github.com/sindresorhus/ky) - HTTP client
- [Express](https://expressjs.com/) - Web framework
- [React](https://react.dev/) - UI library
- [Sequelize](https://sequelize.org/) - ORM
- [Luxon](https://moment.github.io/luxon/) - Date management library
- [Nodemon](https://nodemon.io/) - Process monitoring
- [React Toastify](https://github.com/fkhadra/react-toastify) - Toast library
- [React Intl](https://formatjs.io/docs/react-intl/) - i18n library for React

## License

meteoclimb is licensed under the MIT License - see the
[LICENSE](https://github.com/vmbdev/meteoclimb/blob/main/LICENSE)
file for more details.

## Credits

Flag icons by [flag-icons](https://github.com/lipis/flag-icons)

Humidity, Snow, Sun, Weather, Temperature, Arrows, Rain, Moon, Day and Night,
Info and Setting icons created by [Freepik - Flaticon](https://www.flaticon.com/).
