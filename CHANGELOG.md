# Changelog

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

### Fixed

- [Backend] Location search will normalize the name in the server rather than
in (Postgres) SQL. This helps reducing the dialect dependency.

## [1.0.0] - 2023-10-26

### Changed

- First version
