# WebRTC playground

This is a simple Node/Express server made to test WebRTC experiments.

Unlike other major repo's and API's out there, this is designed to seperate each testing instance of WebRTC into their own files, both front-end and back-end, and run on a server which each example is shared from by Express.

Other major libraries are excellent for getting stuck in deep with WebRTC, but I found there are so many experimental examples which use different files and other code between them, making it difficult for a beginner to see *exactly* what is needed to perform different tasks.

This repo separates this into different files, and whilst it does re-use basic functionality, it's nice to see everything encapsulated into it's own file.

## Install

* Download or clone the repo, `cd` into the repo, and `npm install` (to download dependancies)
* Run `npm run start` into the terminal
* Visit the URL in the terminal after the server is loaded

## What features of WebRTC can I see?

I have included 2 basic WebRTC examples:

### Show camera

This is using `getUserMedia` to retrieve the devices camera and/or microphone for use. Most other implementations of WebRTC are built on top of this base feature.

### Record camera to Node JS server

This is a slightly more complex feature which I have abstracted out by using a great plugin called [RecordRTC](https://github.com/muaz-khan/RecordRTC). The Node server and all other packages are included in this repo.
