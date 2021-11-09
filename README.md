# Freeraki

Freeraki is a basic UI for the [meraki-builder](https://github.com/halmartin/meraki-builder) firmware.

## Installation

Grab a release from the releases page and unzip it onto your switch.

## Development

Install dependencies with

    npm i

For live-reloading (without auth or persistent config):

    npm run dev

Navigate to http://localhost:8080

Or, build the static site with

    npm run build

then serve with `lighttpd`

    ./serve.sh

The credentials are `admin`:`admin`.


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
