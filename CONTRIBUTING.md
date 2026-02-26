# Contributing

Pull requests welcome! For major changes, probably best to open an issue first to discuss what you would like to change.

## Development

(optionally) start a dev shell with

    nix develop

Install dependencies

    npm i

For live-reloading:

    [SWITCH_HOST=<switch>] npm run dev

Then navigate to http://localhost:8080.

> **WARN**: specifying the `SWITCH_HOST` environment variable disables the mock WS server in lieu of a live device


## Releasing

[A GitHub action](./.github/workflows/main.yaml)) will create a new release whenever a new version is specified in [`CHANGELOG.md`](./CHANGELOG.md).
