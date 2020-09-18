# Freeraki-ui
Freeraki-ui is a basic UI for the meraki-builder repo.

## Installation
Grab a release from the releases page and unzip it into your switch.

## Development
Running this locally is easy
```bash
npm i
npm run dev
```
Navigate the localhost:8080

## Known Issues
Due to the low amount of RAM available on device, a lot of the password validation is done client-side. Hashing is used consistently but a malicious user can still override your configuration.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.