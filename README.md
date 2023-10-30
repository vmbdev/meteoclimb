# meteoclimb

![meteoclimb](https://raw.githubusercontent.com/vmbdev/meteoclimb/main/public/ogmeteoclimb.png)

**meteoclimb** is a React/Nodejs application to visualize the forecast for
outdoors activities (mainly focused on rock climbing).

You can access the live app on [https://meteoclimb.hippolyta.one](https://meteoclimb.hippolyta.one).

meteoclimb contains both a server (running on ExpressJS) and a front-end (made
with React).

## User Interface

The UI is made with React, FormatJS (React Intl) and SASS.

### Setup

In the first run, you'll need to compile the language files into locales that
the application can use. Using FormatJS'
[React intl](https://formatjs.io/docs/react-intl/), you can do it with the
following command:

```bash
npm run formatjs-compile-all
```

Once the translations are available, you can build the React application using
the following command.

```bash
npm run ui-build
```

Or if you prefer to run the app as a development server:

```bash
npm run ui-start
```

The app runs with [Vite](https://vitejs.dev/guide/cli.html), so you can tweak
the parameters as you need.

The resulting build will be available in the **build** directory. The backend
server will automatically detect it at the start and serve it in the root URL.

## Backend Server

The backend runs on Express 4 and uses Sequelize for connecting to the
database.

### Setup

First of all, you'll need an OpenWeather API key (currently the only provider
available). You can get one from [here](https://openweathermap.org/appid).

Rename /api/config/**meteo.config.example.js** to
/api/config/**meteo.config.js**, and edit it to match your set up. For example:

```javascript
import databaseConfig from './database.json' assert { type: "json" };

export const config = {
  server: {
    // if changed, remember to update it in src/config.js
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
**/api/config/database.example.json** to **/api/config/database.json** and
edit your database information there. For example:

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
npm run db-migrate
```

Now we need to fullfill the database with the list of supported locations. For
this, we'll need the city list from OpenWeather
[here](https://bulk.openweathermap.org/sample/). Both city.list.json and
city.list.min.json are valid. Save it on the root of the project and run:

```bash
npm run db-seed
```

Now that the database is ready, we can start the server with the following
command:

```bash
npm run server-prod
```

If you plan to make changes on the code, run it in development mode:

```bash
npm run server-dev
```

## Credits

Flag icons by [flag-icons](https://github.com/lipis/flag-icons)

Humidity, Snow, Sun, Weather, Temperature, Arrows, Rain, Moon, Day and Night,
Info icons created by Freepik - Flaticon

[Toggle switch design](https://codepen.io/himalayasingh) by Himalaya Singh.
