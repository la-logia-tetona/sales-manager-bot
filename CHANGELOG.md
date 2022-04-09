# CHANGELOG.md

## [0.5.0] - 2022-04-09
### Added
- Added version to sale button customId.
- Added validation for content length less than 2000 chars.
- Added AccessLog class.
- Added AccessLogMessage class.
- Added Clock class.
- Added tz environment variable.
### Changed
- Extended public title to 64 chars and truncated with underscore.string library. Thank you cool-bits!
### Fixed
- Fixed security issue with command history. Thank you Cucchi!
- Cleanted mentions from thread name.

## [0.4.0] - 2022-04-06
### Changed
- We go live!

## [0.3.0] - 2022-03-29
### Added
- Added GitHub actions
### Fixed
- Fixed .gitignore to hide Discord bot token
- Fixed production Dockerfile

## [0.2.0] - 2022-03-17
### Added
- Added env variable for autoArchiveDuration and threadType
- Added i18n for en, es languages
### Changed
- Simplified bot replies to shorter ones.