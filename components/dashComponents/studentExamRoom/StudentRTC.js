import React, { useRef, useState, useEffect } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import { async } from '@firebase/util';
import Script from 'next/script';
import axios from 'axios';

// Getting firebase
const firestore = getFirestore();

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

// The RTC connection
const pc = new RTCPeerConnection(servers);

let enableBlur = true;
let blurAmount = 20;
let threshold = 70;
let enableBackground = false;
let virtualBackground;
let enableFilter = true;

export default function StudentRTC(props) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [start, setStart] = useState(false);
  const [callDoc, setCallDoc] = useState();
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);
  const [filterPreferences, setFilterPreferences] = useState([]);
  const localStream = props.localStream

  let flipHorizontal = false;
  const videoHeight = 480;
  const videoWidth = 640;
  const videoRef = useRef();
  const canvasRef = useRef();

  // To receive audio
  const remoteAudioRef = useRef();
  // const remoteRef = useRef();

  // Gets the call ID from the database
  // Puts event listener on start button when offer is available
  const getCall = async () => {
    const callDoc = doc(firestore, `students/${props.studentId}/Exam`, 'call');
    // const callDoc = doc(firestore, `subjects/${props.subject}/call`, props.studentId);
    // const callDoc = doc(firestore, `subjects/MAT100/call`, JSON.stringify(props.studentId));
    setCallDoc(callDoc);
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.offer && !data?.answer) {
        setStart(true);
      } else {
        setStart(false)
      }
    })
  }

  // Call getCall() on render
  useEffect(() => {
    getFilterPreferences(props.token)
    // Get Virtual Background
    const img = new Image();
    img.src = "/LogoBG.PNG";
    img.onload = () => {
      virtualBackground = img;
    }

    // Get Call ID
    getCall();
  }, [])

  async function getFilterPreferences(token) {
    await axios({
      method: "POST",
      url: "https://protoruts-backend.herokuapp.com/student/get-filter-preferences",
      data: {
        idToken: token
      },
      withCredentials: true,
    }).then((res) => {
      setFilterPreferences(res.data)
      enableBlur = res.data[0];
      blurAmount = res.data[1];
      threshold = res.data[2];
      enableBackground = res.data[3];
    })
  }

  // console.log(props.screenStream)
  const setupSources = async () => {
    // Combine local stream and face blur
    initializeVideo();
    let stream = canvasRef.current.captureStream();
    stream.addTrack(localStream.getAudioTracks()[0]);
    // stream.addTrack(props.screenStream)
    // Getting tracks for stream to push to invigilator
    stream.getTracks().forEach((track) => {
      console.log("adding student track")
      // console.log(track)
      pc.addTrack(track, stream);
      // console.log(track)
      // console.log(stream)
    });
    if (props.screenStream)
      pc.addTrack(props.screenStream, stream);

    // Conditional render when webcam is active
    setWebcamActive(true);
    // Defining the required collections and documents in database
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");
    //add ice candidates to the database
    pc.onicecandidate = (event) => {
      event.candidate &&
        addDoc(answerCandidates, event.candidate.toJSON());
    };
    // Adding remote audio tracks
    const remoteStream = new MediaStream();
    pc.ontrack = (event) => {
      console.log(event)
      if (event.streams[0]) {
        remoteStream.addTrack(event.streams[0].getAudioTracks()[0])
      };
    };
    // remoteRef.current.srcObject = remoteStream;

    // pc.ontrack = (event) => {
    // console.log(pc.getSenders());
    // console.log(event.track)
    // console.log(event.streams[0])
    // if(event.track.kind === 'audio')
    //   remoteStream.addTrack(event.track);
    // };
    // Setting the remote audio
    remoteAudioRef.current.srcObject = remoteStream;
    //getting offers from database
    const callData = (await getDoc(callDoc)).data();
    const offerDescription = callData.offer;
    // Setting offer from database
    await pc.setRemoteDescription(offerDescription);
    console.log("remote description set!")
    // Creating and Sending answer
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await updateDoc(callDoc, { answer });
    // When there is a new offer, send a new answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      // console.log(data?.offer);
      if (data?.offer && !data?.answer && pc.connectionState === "disconnected") {
        newAnswer(callDoc, data.offer);
      }
    })
    // When there is a new ice candidate, add it
    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          try {
            pc.addIceCandidate(new RTCIceCandidate(data));
          } catch (err) {
            console.log(err);
          }
        }
      });
    });

    // Try to reconnect on disconnect and update status
    pc.onconnectionstatechange = (event) => {
      // console.log(pc.connectionState)
      setConnectionStatus(pc.connectionState);
      props.setConnectionStatus(pc.connectionState);
      if (pc.connectionState === "disconnected") {
        retry();
      }
    };
  };

  // If there is a new offer then create a new answer to reconnect
  const retry = async () => {
    console.log('executing retry')
    // const callDoc = doc(firestore, "students/123454/MATH1001", 'call');
    console.log(callDoc);
    //getting offers from database
    const callData = (await getDoc(callDoc)).data();
    if (callData.offer && !callData.answer)
      newAnswer(callDoc, callData.offer);
  }

  // Creates a new answer for a new offer when there is a disconnect
  const newAnswer = async (callDoc, offer) => {
    console.log("calling new answer")
    try {
      await pc.setRemoteDescription(offer);
    } catch (err) {
      console.log(err)
    }
    // Creating a new answer for the new offer
    const answerDescription = await pc.createAnswer();
    if (pc.signalingState !== "stable") {
      try {
        await pc.setLocalDescription(answerDescription);
      } catch (err) {
        console.log(err)
      }
    }
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await updateDoc(callDoc, { answer });
  }

  /* <----------------------- Face Blur -------------------------------> */
  function stopVideo() {
    localStream.current && localStream.current.getTracks().forEach((x) => x.stop());
    localStream.current = null;
  }

  async function initializeVideo() {
    try {
      if (localStream != null) {
        videoRef.current.srcObject = localStream;
        videoRef.current.play();
        videoRef.current.addEventListener("loadeddata", async () => {
          const net = await bodyPix.load();
          processVideo(net)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  function handleToggleFilter() {
    enableFilter = !enableFilter
    if (!enableFilter) {
      enableBlur = false;
      enableBackground = false;
    } else {
      enableBlur = filterPreferences[0];
      enableBackground = filterPreferences[3];
    }
  }

  function addBlur(segmentation) {
    let backgroundBlurAmount = enableBlur ? blurAmount : 0;
    const edgeBlurAmount = 3;
    const flipHorizontal = false;
    
    bodyPix.drawBokehEffect(
      canvasRef.current,
      videoRef.current,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    )
  }

  function removeBackground(segmentation) {
    const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor);
    const ctx = canvasRef.current.getContext("2d");
    ctx.putImageData(backgroundDarkeningMask, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function addBackground() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(virtualBackground, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  async function processVideo(net) {
    try {
      const segmentation = await net.segmentPerson(videoRef.current, {segmentationThreshold: threshold/100});
      
      if (enableBackground) {
        removeBackground(segmentation)
        addBackground()
      } else
        addBlur(segmentation)
      
      requestAnimationFrame(() => {
        processVideo(net)
      })
    }
    catch (err) { }
  }


  /* <------^^^^^^^------------ Face Blur ------------^^^^^^^^---------> */
  // console.log(props.localStream)

  return (
    <div>
      <video ref={videoRef} playsInline muted height={videoHeight} width={videoWidth} hidden={true} />
      <canvas ref={canvasRef} height={videoHeight} width={videoWidth} style={{width: 500}}/>
      <audio ref={remoteAudioRef} autoPlay ></audio>
      {/* <video ref={remoteRef} autoPlay playsInline height={videoHeight} width={videoWidth} /> */}
      <div>
      {!webcamActive ? (
        <div className="modalContainer">
          <h3>
            Turn on your camera and microphone and start the
            call
          </h3>
          <button
            onClick={setupSources}
            disabled={!start}
            >Start</button>
        </div>
      ) : (
        <div>
          {/* <p>{connectionStatus}</p> */}
          <button
            onClick={retry}
            disabled={connectionStatus === "connected" || !start}
            >
            retry
          </button>
        </div>
      )}
      <button onClick={handleToggleFilter}>Filter ON/OFF</button>
      </div>
        {/* Note From Evan: Importing body-pix as script to allow face api and blur to work together */}
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.2.0"></Script>
    </div>
  );
}