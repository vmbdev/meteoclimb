# Changelog

## [1.0.8] - 2024-01-30

### Added

- [UI and Backend] Air Pollution detection.
- [UI] Property types are now checked with PropTypes. One day I'll migrate
meteoclimb to TypeScript, but in the meanwhile...

### Changes

- [UI] Weather conditions (third row of forecast) will now show more icons depicting
the weather (i.e. thunderstorms, clouds, clear...).
- [UI] Rewritten the help modal to be more descriptive.
- [UI] Modal Window improved visually.
- [UI] Visual update of several other components.
- [UI] Updated styles to be more responsive.
- [UI] Updated markup to be more semantic.
- [UI] Updated translations.
- [UI] Renamed a lot of the components to a more significative name.
- [General] Migrated test framework to Vitest.
- [General] Updated dependencies.
- [General] Code cleanup.

### Fixes

- [UI] Fixed a bug in which the total precipitation could display a lot of decimals.
- [Backend] Fixed the wrong path for the config file in sequelizerc.

## [1.0.7] - 2023-12-13

### Changes

- [UI and Backend] API is now a little bit more RESTful, and getting a
Forecast object won't send anymore a City object too. A new API call
(/api/city/:id) enables the user to grab the City, having a city Id.

## [1.0.6] - 2023-12-12

### Fixes

- [UI] SettingsMenu background not showing on dark theme.

## [1.0.5] - 2023-12-12

### Changes

- [Backend] Removed got dependency, using instead Ky as it's already installed
for the UI.
- [General] Updated documentation.

## [1.0.4] - 2023-12-12

### Added

- [General] A LICENSE file for our MIT license. Can you believe I forgot it?

### Changed

- [General] JSDoc will now create two separate documentations
(backend/frontend).
- [UI] Updated to Vite 5.
- [UI] Visual update.
- [UI] Refactored some components to attend their responsibilities.
- [UI] Updated translations.
- [UI] Temperature degrees will now display rounded integer values.
- [UI] New settings menu containing all possible user choices.
- [UI] User can now choose the measurement units for temperature and wind.
- [Backend] Updated to nodemon 3.

### Fixes

- [General] Fixes FormatJS script producing empty translation files.
- [UI] Fixes search bar displaying an incorrect width with some devices.

## [1.0.3] - 2023-10-31

### Added

- [UI] Using Ky to simplify error management.
- [UI] Better error management.
- [UI] Implementation of a Toast system with React-Toastify (mainly for errors).

### Changed

- [UI] File structure now matches kebab-case.
- [UI] Some code cleanup.

### Fixes

- [General] Fixes README.md and the example config files after last update.

## [1.0.2] - 2023-10-30

### Changed

- [UI] Whole React UI moved to /frontend.
- [General] React dependencies moved to development dependencies to avoid
having to install them when only running the backend.

### Fixes

- [General] Duplicated /database and /sequelize.

## [1.0.1] - 2023-10-30

### Added

- [General] Better documented code.
- [Backend] Better error management.

### Changed

- [General] Code cleanup.
- [UI] Functionality from Search component moved to ApiService.
- [Backend] Renamed /api to /backend.
- [Backend] Refactored most functions from Forecast Controller into a service.
- [Backend] Renamed /database to /sequelize, to avoid confusion.
- [Backend] Moved the database config file to api/config/database.json.

### Fixes

- [Backend] Location search will normalize the name in the server rather than
in (Postgres) SQL. This helps reducing the dialect dependency.

## [1.0.0] - 2023-10-26

### Changed

- First version
