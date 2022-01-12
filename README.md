# Freeraki

Freeraki is a basic UI for the [meraki-builder](https://github.com/halmartin/meraki-builder) firmware.

![screenshot](./screenshot.png)

## Installation

Until there are releases available, build the static site with

    npm run build

then copy the newly-created `./build` directory to your switch:

    scp -r ./build <switch>:

Now, on the switch, update the permissions

    chmod o+r -R ./build
    chmod o+x -R ./build/cgi-bin

and start `uhttpd`

    uhttpd -p 80 -h ./build

Open http://<switch> in your browser and use your PAM login credentials.

**NOTE**: the `configd` daemon must currently be manually started (and, given
the alpha nature of this program, it's not recommended to automate it at boot)

## Development

Install dependencies with

    npm i

For live-reloading (without auth or persistent config):

    npm run dev

Navigate to http://localhost:8080



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
