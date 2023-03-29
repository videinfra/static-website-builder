# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.6.4] - 2023-03-29
### Updated
- Added stylesheet source path to the default include paths

## [1.6.3] - 2022-10-25
### Fixed
- Error fix for OSX when changing any HTML file

## [1.6.1] - 2022-10-21
### Fixed
- `false` task config being overwritten by empty array resulting in task being performed

## [1.6.0] - 2022-06-20
### Updated
- gulp-sass to use latest node-sass version
### Added
- `stylesheets.legacy` configuration option to turn off `node-sass` and use `sass`

## [1.5.2] - 2022-06-17
### Updated
- In build mode prevent data from being read more than once

## [1.5.1] - 2022-04-14
### Fixed
- Dependency update

## [1.5.0] - 2022-04-13
### Fixed
- Read files in `data` folder recursively

## [1.4.3] - 2022-03-08
### Fixed
- Fixed negative glob paths not working

## [1.4.2] - 2021-08-27
### Fixed
- Fixed postcss-ignore-plugin only removing and adding content in unrelated files

## [1.4.1] - 2021-05-20
### Fixed
- Enabled postcss-ignore-plugin only when cssnano is used

## [1.4.0] - 2021-05-20
### Added
- Added postcss-ignore-plugin

## [1.3.2] - 2021-04-07
### Added
- Added gulp-dependents plugin to the .scss files for faster builds

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
