import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import ReactPlayer from "react-player/lazy";
import ChatBox from "../ChatBox";
import openSocket from "socket.io-client";
import UserList from "../UserList";

//! Socket Connection For global use
const socket = openSocket("/");

const Chat = (props) => {
  //! Users and Room Related
  const [name, setName] = useState(""); //* hold cuurent user name
  const [yourID, setYourID] = useState(""); //* hold current userId
  const [room, setRoom] = useState(""); //* hold current room name
  const [users, setUsers] = useState([]); //* hold all users data

  //! Text Chat Related
  const [msg, setMsg] = useState(""); //* hold current text input message
  const [messages, setMessages] = useState([]); //* hold all messages of a room

  //! Video Call Related
  const [receivingCall, setReceivingCall] = useState(false); //* use to prompt ask user to accept or reject call
  const [callAccepted, setCallAccepted] = useState(false); //* use to show remote video tag once connection complete
  const [callerData, setCallerData] = useState({ id: "", name: "" }); //* hold caller data at receiver end
  const [showLocalVideo, setShowLocalVideo] = useState(false); //* when local video stream available then use to show local video tag
  const [connectedUser, setConnectedUser] = useState([]); //* hold list of connected user for video call
  //! Youtube related
  const [url, setUrl] = useState("");
  const [play, setPlay] = useState(false);
  const [load, setLoad] = useState(false);

  //? useRef for hold data even after re-render
  const streamRef = useRef(); //? hold local video stream for sending to peerConnection
  const localVideo = useRef(); //? hold local stream for local video stream object
  const peerRef = useRef(); //? hold peerConnection Object
  const remoteVideo = useRef(); //? hold remote user video stream object
  const dataChannel = useRef(); //? hold dataChannel Event

  useEffect(() => {
    if (props.location.state.name === "" || props.location.state.room === "") {
      props.history.location.push("/");
    } else {
      setName(props.location.state.name);
      setRoom(props.location.state.room);
      //console.log(socket);
      socket.emit(
        "join",
        { name: props.location.state.name, room: props.location.state.room },
        (err) => {
          console.log(err);
        }
      );
      //* get local video stream
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          setShowLocalVideo(true);
          streamRef.current = stream; //? stream=MediaObject()
          localVideo.current.srcObject = stream;
        })
        .catch((err) => {
          console.error(err);
          alert("Camera Access Denied!");
        });

      //* handle socket events for video call related
      socket.on("offer", handleOffer); //? at receiver end -> when caller call
      socket.on("answer", handleAnswer); //? at caller end -> when receiver send his answer
      socket.on("ice-candidate-from-caller", handleNewIceCandidateFromCaller); //? at receiver end -> accept ice candidate
      socket.on(
        "ice-candidate-from-receiver",
        handleNewIceCandidateFromReceiver
      ); //? at receiver end -> accept ice candidate
    }
    return () => {
      loadVideo.current = null;
      streamRef.current = null;
      dataChannel.current = null;
      socket.emit("disconnect");
      socket.off();
      if (peerRef.current) {
        peerRef.current.close();
      }
    };
    // eslint-disable-next-line
  }, [props.location]);

  //! handle chat messages
  useEffect(() => {
    setYourID(socket.id);
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("left", ({ id }) => {
      if (callerData.id === id) {
        setCallAccepted(false);
        peerRef.current.close();
      }
    }); // eslint-disable-next-line
  }, [messages]);
  //? send meesage to other users
  const sendMessage = (e) => {
    e.preventDefault();
    if (msg) {
      socket.emit("sendMessage", msg, () => {
        setMsg("");
      });
    }
  };

  //! handle Video Call

  //* #### CALLER SIDE PEER CONNECTION LOGICS ####
  const makeCall = (userId, userName) => {
    //check if already connected with other
    if (connectedUser.length > 0) {
      alert("You are already connected with someone first disconnect");
      return;
    }

    //? start peer connection from caller side
    let receiver = { id: userId, name: userName };

    //?ice servers set of URL's of STUN/TURN Server
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peer = new RTCPeerConnection(configuration);
    peerRef.current = peer; //* set peerConnection at caller side for global use
    //? create data channel
    dataChannel.current = peerRef.current.createDataChannel("datachannel");
    if (dataChannel.current) {
      dataChannel.current.onopen = (e) => {
        console.log("opened at caller");
      };
      dataChannel.current.onmessage = handleData;
    }

    streamRef.current //* attach caller video stream to peer connection
      .getTracks() //? => [audioTrack,videoTrack]
      .forEach((track) => peerRef.current.addTrack(track, streamRef.current)); //? add both tracks as MediaObject type from streamRef

    peerRef.current.onicecandidate = (
      e //? getting this event from STUN SERVER with ICE-Candidate(e)
    ) => sendIceCandidateToReceiver(e, receiver); //? send ice candidate to receiver

    //* only at caller side
    peerRef.current.onnegotiationneeded = () =>
      //? create and send offer to receiver
      handleNegotiationNeededEvent(receiver);

    peerRef.current.ontrack = handleTrackEvent; //? handle remote stream once connection established
  };

  const handleNegotiationNeededEvent = async (receiver) => {
    try {
      let offer = await peerRef.current.createOffer(); //* create offer
      if (offer) {
        peerRef.current.setLocalDescription(offer); //? save offer data as localDesc
        let caller = { id: yourID, name: name };
        let signal = peerRef.current.localDescription; //? get created offer which was save as localDesc
        socket.emit("sendOffer", { receiver, caller, signal }); //? send offer to receiver end
      }
    } catch (error) {
      console.error(error);
    }
  };
  //* start ice candidate handshake at caller side
  //? send ice candidate from caller to receiver
  const sendIceCandidateToReceiver = (e, receiver) => {
    if (e.candidate) {
      let payload = {
        receiver,
        caller: { id: yourID, name: name },
        icecandidate: e.candidate,
      };
      socket.emit("send-ice-candidate-to-receiver", payload);
    }
  };
  //? handle ice-candidate from receiver side and accept it by caller
  const handleNewIceCandidateFromReceiver = (icecandidate) => {
    const candidate = new RTCIceCandidate(icecandidate);
    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  };
  //* ice-candidate handshake complete at caller side

  //* #### CALLER SIDE END ####

  //* #### RECEIVER SIDE PEER CONNECTION LOGICS ####
  const handleOffer = ({ signal, receiver, caller }) => {
    //! This initail setup required before waiting for receiver reponse

    setReceivingCall(true); //? show prompt to ask user to accept ot reject call
    //* save caller information
    setCallerData({ id: caller.id, name: caller.name });

    //? INIT PeerConnection at Reciever Side
    //? Ice servers are set of URL's of STUN/TURN Servers which can we created using coturn npm package
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peer = new RTCPeerConnection(configuration);
    peerRef.current = peer; //* set receiver peerConnection for global use

    const desc = new RTCSessionDescription(signal); //? save offer as sessionDesc

    //? listen for data channel connection
    peerRef.current.addEventListener("datachannel", (event) => {
      dataChannel.current = event.channel;
      dataChannel.current.onopen = (e) => {
        console.log("open at reciever side");
      };
      dataChannel.current.onmessage = handleData;
    });

    //? accepting signal save remote user signal
    peerRef.current.setRemoteDescription(desc).then(() => {
      //attaching my stream to peer connection
      streamRef.current //* attach receiver video stream to peer connection
        .getTracks() //? => [audioTrack,videoTrack]
        .forEach(
          (track) => peerRef.current.addTrack(track, streamRef.current) //? add both tracks as MediaObject type from streamRef
        );
    });
    //! Wait to reciever to accept Call
    //? getting this event from STUN SERVER with ICE-Candidate(e)
    peerRef.current.onicecandidate = (e) => sendIceCandidateToCaller(e, caller); //? send ice candidate of receiver to caller

    peerRef.current.ontrack = handleTrackEvent; //? handle remote stream once connection established
  };

  //* Fire When User Accept Call
  const acceptCall = () => {
    setReceivingCall(false);

    //* create receiver side offer i.e. answer
    peerRef.current
      .createAnswer()
      .then((answer) => {
        //? save receiver answer as localDesc
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        //? send receive answer back to caller
        let signal = peerRef.current.localDescription;
        let caller = { id: callerData.id, name: callerData.name }; //? here caller is who call to receiver
        let receiver = { id: yourID, name: name }; //? here receiver is who caller call's .i.e. current user
        socket.emit("sendAnswer", { signal, caller, receiver });
        setConnectedUser((prev) => [...prev, caller.id]);
      });
  };

  //* handle Answer (i.e. receiver offer) and accept answer by caller
  const handleAnswer = ({ signal, receiver, caller }) => {
    const desc = new RTCSessionDescription(signal); //? save answer as sessionDesc
    //? saving answer as remoteDesc
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
    setCallAccepted(true); //? show rermote video tag
    //? callerData is not usable in caller side so using it for hold receiver data!!
    //? it will be use to show name of user on remote video tag
    setCallerData({ id: receiver.id, name: receiver.name }); //? save receiver data

    //?save connected User
    setConnectedUser((prev) => [...prev, receiver.id]);
    //* handshake complete
  };

  //* start ice-candidate handshake from receiver side
  //? send ice candidate from receiver to caller
  const sendIceCandidateToCaller = (e, caller) => {
    if (e.candidate) {
      let payload = {
        caller,
        receiver: { id: yourID, name: name },
        icecandidate: e.candidate,
      };
      socket.emit("send-ice-candidate-to-caller", payload);
    }
  };
  //? handle ice-candidate from caller and accept by receiver
  const handleNewIceCandidateFromCaller = (icecandidate) => {
    const candidate = new RTCIceCandidate(icecandidate);
    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  };
  //* ice-candidate handshake completed

  //* #### RECEIVER SIDE END ####

  //! common for caller and receiver to handle remote stream
  const handleTrackEvent = (e) => {
    setCallAccepted(true);
    remoteVideo.current.srcObject = e.streams[0];
  };
  //! video Call disconnect
  const disconnect = (id) => {
    dataChannel.current.send(JSON.stringify({ type: "disconnect", id: id }));
    peerRef.current.close();
    let temp = connectedUser.filter((ul) => ul !== id);
    setConnectedUser(temp);
    setCallerData("");
    setReceivingCall(false);
    setCallAccepted(false);
    remoteVideo.current = null;
    dataChannel.current = null;
    peerRef.current = null;
  };
  //* youtube video related
  const playVideo = () => {
    setPlay(true);
    if (dataChannel.current) {
      dataChannel.current.send(JSON.stringify({ type: "play" }));
    }
  };
  const pauseVideo = () => {
    setPlay(false);
    if (dataChannel.current) {
      dataChannel.current.send(JSON.stringify({ type: "pause" }));
    }
  };
  const loadVideo = (e) => {
    e.preventDefault();
    if (url.length === 0) {
      alert("URL is Required");
      return;
    }
    setLoad(true);
    if (dataChannel.current) {
      dataChannel.current.send(JSON.stringify({ type: "load", videoId: url }));
    }
  };
  const handleData = (e) => {
    const data = JSON.parse(e.data);
    console.log(data);
    if (data.type === "load") {
      setUrl(data.videoId);
      setLoad(true);
    } else if (data.type === "pause") {
      setPlay(false);
    } else if (data.type === "play") {
      setPlay(true);
    } else if (data.type === "disconnect") {
      peerRef.current.close();
      let temp = connectedUser.filter((ul) => ul !== data.id);
      //console.log(temp);
      setConnectedUser(temp);
      setCallerData("");
      remoteVideo.current = null;
      dataChannel.current = null;
      peerRef.current = null;
      setReceivingCall(false);
      setCallAccepted(false);
    }
  };
  return (
    <div className="m-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <UserList
              users={users}
              disconnect={disconnect}
              connectedUser={connectedUser}
              user={yourID}
              makeCall={makeCall}
            />
            <br />
            {showLocalVideo ? (
              <div
                id="Carousel1"
                className="carousel slide shadow-soft border border-light p-2 rounded"
                data-ride="carousel"
              >
                <div className="carousel-inner rounded">
                  <div className="carousel-item active">
                    <h5 className="font-weight-bold">
                      <i className="las la-user-tie la-lg"></i> {name}
                    </h5>
                    <video
                      playsInline
                      muted
                      className="d-block w-100"
                      controls
                      ref={localVideo}
                      autoPlay
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <br />
            {receivingCall === true ? (
              <div className="lead">
                <h6>
                  <span className="font-weight-bold">{callerData.name}</span> is
                  calling you.
                  <span
                    className="btn btn-sm btn-primary text-success"
                    onClick={acceptCall}
                  >
                    <i className="las la-phone-volume la-lg"></i> Accept
                  </span>
                </h6>
              </div>
            ) : null}
          </div>
          <div className="col-md-8">
            <div
              id="Carousel1"
              className="carousel shadow-soft border border-light pl-4 pt-3 pr-4 rounded"
              data-ride="carousel"
            >
              <div className="carousel-inner rounded">
                <div className="carousel-item active">
                  <ReactPlayer
                    url={
                      load
                        ? url
                        : "https://twitter.com/i/status/1279147101054623744"
                    }
                    playing={play}
                    controls
                    onPlay={playVideo}
                    onPause={pauseVideo}
                    playsinline
                    className="d-block w-100"
                    pip
                  />
                </div>
              </div>
              <div className="form-group mt-2">
                <div className="input-group">
                  <input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                    }}
                    type="url"
                    required
                    id="url"
                    className="form-control"
                    name="url"
                    placeholder="Enter Youtube URL"
                  />
                  <button
                    type="submit"
                    onClick={loadVideo}
                    className="btn btn-sm btn-primary text-secondary"
                  >
                    Load Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-4">
            {callAccepted ? (
              <div
                id="Carousel1"
                className="carousel slide shadow-soft border border-light p-2 rounded"
                data-ride="carousel"
              >
                <div className="carousel-inner rounded">
                  <div className="carousel-item active">
                    <h5 className="font-weight-bold">
                      <i className="las la-user-tie la-lg"></i>{" "}
                      {callerData.name}
                    </h5>
                    <video
                      playsInline
                      ref={remoteVideo}
                      autoPlay
                      muted
                      className="d-block w-100"
                      controls
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-md-8">
            <ChatBox
              msg={msg}
              setMsg={setMsg}
              sendMessage={sendMessage}
              room={room}
              messages={messages}
              name={name}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4 p-4 shadow-inset bg-grey">
        <footer className="justify-content-center  text-center">
          <span className="text-warning font-weight-bold">
            Under Development
          </span>
          <br />
          <a
            rel="noreferrer noopener"
            href="https://www.webfx.com/tools/emoji-cheat-sheet/"
            className="text-dark font-weight-bold"
          >
            Emoji Cheahsheet
            <span className="ml-1">
              <i className="las la-smile-wink la-lg"></i>
            </span>
          </a>
          <br />
          <a
            rel="noreferrer noopener"
            className="text-info font-weight-bold"
            href="https://github.com/masterkn48"
          >
            Created By MasterKN <i class="lab la-github-alt la-lg"></i>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
