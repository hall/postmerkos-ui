# Freeraki

Freeraki is a basic UI for the [meraki-builder](https://github.com/halmartin/meraki-builder) firmware.

![screenshot](./screenshot.png)

## Installation

> **NOTE**: the [`configd`](https://github.com/halmartin/meraki-builder/pull/18)
daemon must currently be manually started (and, given the alpha nature of this
program, it's not recommended to automate it at boot)

Download the latest release

    wget https://github.com/hall/freeraki-ui/releases/latest/download/freeraki-ui.zip 

Move it onto your switch

    scp freeraki-ui.zip <switch>:

Unzip and update the permissions

    unzip freeraki-ui.zip

    chmod o+r -R ./freeraki-ui
    chmod o+x -R ./freeraki-ui/cgi-bin

Start `uhttpd` on port 80

    uhttpd -p 80 -h ./freeraki-ui

Open http://<switch> in your browser and use your PAM login credentials.


## Development

Install dependencies with

    npm i

For live-reloading (without auth or persistent config):

    npm run dev

Navigate to http://localhost:8080

Or, using docker,

    docker run -it -v $PWD:/app -w /app --entrypoint sh node:14-alpine -c "npm i && npm run dev"


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
