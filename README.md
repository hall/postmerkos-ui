# postmerkOS UI

A basic web interface for [meraki-builder](https://github.com/halmartin/meraki-builder) firmware.

![screenshot](./screenshot.png)

## Installation

> **NOTE**: the [`configd`](https://github.com/halmartin/meraki-builder/pull/18)
daemon must currently be manually started (and, given the alpha nature of this
program, it's not recommended to automate it at boot)

1. Download [the latest release](https://github.com/hall/postmerkos-ui/releases).

    ```bash
    wget https://github.com/hall/postmerkos-ui/releases/latest/download/postmerkos-ui.zip 
    ```

2. Move it onto your switch

    ```bash
    scp -O postmerkos-ui.zip <switch>:
    ```

3. Unzip and update the permissions

    ```bash
    unzip postmerkos-ui.zip

    chmod o+r -R ./postmerkos-ui
    chmod o+x -R ./postmerkos-ui/cgi-bin
    ```

4. Start `uhttpd` on port 80

    ```bash
    uhttpd -p 80 -h ./postmerkos-ui
    ```

5. Open http://$switch in your browser and use your PAM login credentials.


## Credits

- original implementation by WriteCodeEveryday at https://github.com/WriteCodeEveryday/freeraki-ui
- icons by https://github.com/danklammer/bytesize-icons
