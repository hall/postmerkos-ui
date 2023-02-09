# Contributing

Pull requests welcome! For major changes, probably best to open an issue first to discuss what you would like to change.

## Development

(optionally) start a dev shell with

    nix develop

Install dependencies

    npm i

For live-reloading (without auth or persistent config):

    npm run dev

Then navigate to http://localhost:8080.


## Releasing

A GitHub action (defined in [`.github/workflows/main.yaml`](./.github/workflows/main.yaml)) will run whenever a new tag is pushed and create a release.
