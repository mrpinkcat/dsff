# DSFF - Discord Shared Files Finder (CLI)

This is a Javascript Discord bot for **finding files you've shared via discord** message attachement (the + button).
It’s easy to use and save you time when you searching for a old shared file.
- User friendly interface
- Multiple servers support
- File output

![demo](media\demo.gif)

## Installation

### Requirements

You'll need **`node.js`** to get this to work. Here is a [link](https://nodejs.org/) to the download page.

> *OPTIONAL*
> 
> You can install yarn, after finishing the installation of node.js, with the following command:
> 
> ```sh
> npm install --global yarn
> ```

### Dependencies

You can `use` npm or `yarn` for the dependencies installation

#### Using npm

```sh
npm install
```

#### Using yarn

```sh
yarn
```

### Environment variables

Copy the `.env.example` file and rename it to `.env`. You can complete this file with this table:

|KEY|Comment|
|---|---|
|DISCORD_TOKEN|This can be found on the [discord developer portal](https://discord.com/developers/applications)|

## Running

After you've installed DSFF, just run **`npm run start`**, with `npm`, or **`yarn start`**, with yarn, to get the appplication running. Don't forget to invite your bot to your server :)
