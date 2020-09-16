# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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