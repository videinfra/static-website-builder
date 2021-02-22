# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.1] - 2021-02-22
### Fixed
- data JS files not being usable with "require"

## [1.3.0] - 2021-01-27
### Changed
- Replaced gulp.watch with latest chokidar which is more reliable

## [1.2.8] - 2020-11-12
### Changed
- Updated dependencies

## [1.2.7] - 2020-11-03
### Added
- Command `--tasks` to list available tasks

## [1.2.6] - 2020-10-28
### Removed
- gulp-util dependency

## [1.2.5] - 2020-09-24
### Fixed
- cssnano configuration
- disabled `calc()` minification which minifies them incorrectly

## [1.2.4] - 2020-09-16
### Added
- 'ignore' to data task configuration

## [1.2.3] - 2020-09-07
### Fixed
- fixed gulp not working if there is an error when starting watch command

## [1.2.2] - 2020-08-18
### Fixed
- fixed production mode detection being triggered in development mode

## [1.2.1] - 2020-07-13
### Added
- gulp-util to the dependencies


## [1.2.0] - 2020-07-13
### Removes
- .browserlistrc which was overriding per-project browser list
### Changed
- Any task with `-build` in the name will now trigger `production` mode
