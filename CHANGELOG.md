# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.6.0] - 2026-02-26

Websockets and polling, oh my!

### Breaking

- dropped CGI scripts in favor of a websocket connection

### Fixed

- Switch status wins over config file when merging
- PoE status indicator is being displayed again

### Changed

- simplified VLAN config fields

### Added

- inline help text


## [0.5.1] - 2026-02-07

An even further reduction in zip size to `11.9 KB`!

### Changed

- Use toggle boxes instead of radio buttons

### Added

- Link back to repo in header

### Removed

- Removed test files from published artifact
- Removed boilerplate icon files and PWA functionality

## [0.5.0] - 2026-02-07

A reduction in final zip size from `250 KB` to `72.2 KB`.

### Changed

- Migrate from `preact-cli` to `vite`
- Replace `react-modal`, `axios`, and `lodash` with native APIs
- Convert class components to functional components
- Use `nix` in CI workflow

## [0.4.0] - 2023-02-09

### Removed

- Unused lighttpd configuration

## [0.3.2] - 2023-02-09

### Changed

- Use nord theme for softer color palette

## [0.3.1] - 2023-02-09

### Changed

- Simplify and cleanup table layout

## [0.3.0] - 2023-02-09

### Changed

- Grey-out rows of ports which aren't established
