# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.1] - 2020-07-13
### Added
- gulp-util to the dependencies


## [1.2.0] - 2020-07-13
### Removes
- .browserlistrc which was overriding per-project browser list
### Changed
- Any task with `-build` in the name will now trigger `production` mode
