> 🚧 **This project is maintenance mode!** 🚧
> 
> I will be fixing and responding to pull requests and issues, but it is not in active development.

![crypticat](https://raw.githubusercontent.com/kognise/crypticat/master/assets/main-banner.png)

<center><em>Crypticat is a very minimal end-to-end encrypted chat protocol/platform with emphasis on ease of usability.</em></center>

[Try it out here!](https://c.kognise.dev/) A public websocket server is available at `wss://u.kognise.dev/`.

With npm installed, you can install the cli with `npm i -g @crypticat/cli` then run `crypticat wss://u.kognise.dev/`. If you want to start a server, run `crypticat serve` with a port as an optional 3rd argument. It'll default to port 8080.

## Goals

- It should be secure
- Message records shouldn't be stored anywhere
- Anyone should be able to run their own server
- It should be open-source and extensible
- The web ui and cli should have the same usability

## Architecture

Messages are e2e encrypted with aes-256, and keys are exchanged with the [diffie-hellman]([https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange](https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange)) method.

This codebase is a monorepo, made up of 4 packages:

- The core client and server libraries (`@crypticat/core`)
- The command-line interface (`@crypticat/cli`)
- The next.js powered website
- A react wrapper for [ionicons](https://ionicons.com/) (`@crypticat/ionicons`)

## Development

The monorepo is managed with yarn workspaces. Make sure you have node 10+ installed as well as yarn, and then just run `yarn` to install needed dependencies.

The cli, core, and icon set are written in typescript. Run `yarn workspace @crypticat/core tsc` to run tsc one-off, or `yarn workspace @crypticat/core watch` to start the compiler in watch mode for development.

You'll probably want to use the cli if you're developing it. First, uninstall crypticat globally and then run `yarn workspace @crypticat/cli link`. You should now be able to run `crypticat` and it'll run the local compiled version.

The website is written in next.js and deployed on [now](now.sh), deploy it with `now` and run the dev server with `yarn workspace @crypticat/website dev`.

The icon set has a generator script that pulls the icons from ionic's github repo and converts them to react. You can run it with `yarn workspace @crypticat/ionicons gen`. Make sure to run tsc afterwards!

Finally, if you want to publish a package and you have permission, run `yarn bump`.
