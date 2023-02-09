# postmerkOS UI

A basic web interface for [meraki-builder](https://github.com/halmartin/meraki-builder) firmware.

![screenshot](./screenshot.png)

## Installation

> **NOTE**: the [`configd`](https://github.com/halmartin/meraki-builder/pull/18)
daemon must currently be manually started (and, given the alpha nature of this
program, it's not recommended to automate it at boot)

Download the latest release

    wget https://github.com/hall/postmerkos-ui/releases/latest/download/postmerkos-ui.zip 

Move it onto your switch

    scp -O postmerkos-ui.zip <switch>:

Unzip and update the permissions

    unzip postmerkos-ui.zip

    chmod o+r -R ./postmerkos-ui
    chmod o+x -R ./postmerkos-ui/cgi-bin

Start `uhttpd` on port 80

    uhttpd -p 80 -h ./postmerkos-ui

Open http://<switch> in your browser and use your PAM login credentials.


## Credits

- Original implementation by WriteCodeEveryday at https://github.com/WriteCodeEveryday/freeraki-ui
- Icons by https://github.com/danklammer/bytesize-icons