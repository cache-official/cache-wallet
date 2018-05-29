![Cache Logo](resources/cache-logo.png)
# Cache Wallet
This is the official Cache Wallet.

This project is an enhanced version of the NEM Nano Wallet.

It is built with AngularJS (Old Angular) and wrapped in Electron

## Use the Wallet

To use the Cache Wallet download the latest release of the app for your operating system:

[Cache Wallet Releases](https://github.com/cache-official/cache-wallet/releases)

# Developers

## Installation

This project is built using Node v10.2.1 and NPM 6.1.0

1. Run  `git clone https://github.com/cache-official/cache-wallet.git`
2. Run `cd cache-wallet`
3. Run `npm install`

## Development

To run the app in development mode, after performing installation steps stay inside the project directory and:

1.  Run `npm build`
2.  Then run `npm start`

## Deployment

After installation steps, to publish for macOS, Windows, and Linux do the following:

1. Run `npm build`
2. Run `npm run publish-mac`
3. Run `npm run publish-win`
4. Run `npm run publish-linux`