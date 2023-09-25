# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2023-09-25
### Fixed
- Issue when trying to save data with modular content. This makes sure it will always use the `_word_counter` suffixed fields or custom set fields correctly and will get data even when data is localized.

## [1.5.3] - 2023-08-11
### Changed
- Scripts for prettier and a pre-commit hook so code styling is consistent
### Security
- Update all dependencies to their latest version

## [1.5.2] - 2023-06-20
### Changed
- Publish package signed with npm package provenance.

[1.6.0]: https://github.com/voorhoede/datocms-plugin-word-counter/compare/v1.5.3...v1.6.0
[1.5.3]: https://github.com/voorhoede/datocms-plugin-word-counter/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/voorhoede/datocms-plugin-word-counter/compare/v1.5.1...v1.5.2
