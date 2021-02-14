## 					Video Chat : Watch YouTube Together With Friends

[![Website shields.io](https://img.shields.io/badge/Version-0.9-GREEN)](https://vch1.herokuapp.com) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

DEMO: [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://vch1.herokuapp.com)

It is a video chat application which uses web sockets, webRTC technology with mesh topology to do peer to  peer connection between users. Currently it only support 2 user video calling.

After joining room all users can do video chat, text chat, watch any you-tube video together by real time synchronisation of videos like any user pause or play video will leads to same effect on all other ends.
<strong>This project is under development</strong>, currently support video call one at a Time. 
<strong>Next objective is to implement SFU or MCU Architectures</strong> for group video connection.
Currently Mesh Topology is under usage for group video call.

##### REQUIREMENTS:

[![Website shields.io](https://img.shields.io/badge/Node.js->=10.0.2-BLUE)](https://nodejs.org/en/) [![Website shields.io](https://img.shields.io/badge/NPM->=6.0.2-INDIGO)](https://www.npmjs.com/) [![Website shields.io](https://img.shields.io/badge/React.js->=16.0.0-SKYBLUE)](https://reactjs.org/) [![Website shields.io](https://img.shields.io/badge/Socket.io->=2.0.0-YELLOW)](https://socket.io/)  [![Website shields.io](https://img.shields.io/badge/-WEBRTC-RED)](https://webrtc.org/)

```bash
1. git clone https://github.com/MasterKN48/Group_Video_Chat.git
## DEVELOPMENT MODE
2. npm run development
# Another terminal
3. cd client
4. npm start
## PRODUCTION MODE
5. npm run production
```

##### WebRTC Handshake

<img src="/images/webRTC_handshake.jpeg" alt="webRTC_handshake" style="zoom:80%;" />

How to Setup STUN/TURN Server? [Medium Article](https://medium.com/av-transcode/what-is-webrtc-and-how-to-setup-stun-turn-server-for-webrtc-communication-63314728b9d0)

##### Is it safe?

> Encryption is mandatory for all WebRTC components. With RTCDataChannel all data is secured with [Datagram Transport Layer Security](https://en.wikipedia.org/wiki/Datagram_Transport_Layer_Security) (DTLS). DTLS is a derivative of SSL, meaning your data will be as secure as using any standard SSL based connection. DTLS is standardized and built in to all browsers that support WebRTC. You can find more information about DTLS on the [Wireshark wiki](http://wiki.wireshark.org/DTLS).



[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://masterkn.codes) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
