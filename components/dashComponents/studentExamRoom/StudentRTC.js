import React, { useRef, useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import { async } from '@firebase/util';
const bodyPix = require('@tensorflow-models/body-pix');


// initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAY0GdJm87pXHr_pVvLO3_yZf3xetzyASY",
  authDomain: "webrtc-test-96c34.firebaseapp.com",
  databaseURL: "https://webrtc-test-96c34-default-rtdb.firebaseio.com",
  projectId: "webrtc-test-96c34",
  storageBucket: "webrtc-test-96c34.appspot.com",
  messagingSenderId: "315521969341",
  appId: "1:315521969341:web:9ada7fe12ef4f5bec45bd4",
  measurementId: "G-7Y4GHS9HZ1"
}

// initialize Firebase
try {
  initializeApp(firebaseConfig);
} catch {
  console.log("nevermind nothing")
}

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

export default function StudentRTC(props) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [start, setStart] = useState(false);
  const [callDoc, setCallDoc] = useState();
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);
  const localStream = props.localStream

  let blurAmount = 20;
  let enableBlur = true;
  const videoHeight = 480;
  const videoWidth = 640;
  const videoRef = useRef();
  const canvasRef = useRef();

  // Gets the call ID from the database
  // Puts event listener on start button when offer is available
  const getCall = async () => {
    const callDoc = doc(firestore, `students/${props.studentId}/${props.subject}`, 'call')
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
    getCall();
  }, [])

  // useEffect(() => {
  //   if (props.screenStream)
  //     pc.addTrack(props.screenStream, stream);
  // }, [props.screenStream]);

  console.log(props.screenStream)
  const setupSources = async () => {
    // Combine local stream and face blur
    initializeVideo();
    let stream = canvasRef.current.captureStream();
    stream.addTrack(localStream.getAudioTracks()[0]);
    // stream.addTrack(props.screenStream)
    // Getting tracks for stream to push to invigilator
    stream.getTracks().forEach((track) => {
      console.log("adding student track")
      console.log(track)
      pc.addTrack(track, stream);
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
  function reset() {
    localStream.current && localStream.current.getTracks().forEach((x) => x.stop());
    localStream.current = null;
  }

  async function initializeVideo() {
    try {
      //   localStream = await navigator.mediaDevices.getUserMedia({ video: {} })
      if (localStream != null) {
        videoRef.current.srcObject = localStream;
        videoRef.current.play();
        videoRef.current.addEventListener("loadeddata", async () => {
          const net = await bodyPix.load();
          processVideo(net)
        })
      }
    } catch (err) {
      reset();
    }
    return reset();
  }

  async function processVideo(net) {
    try {

      const outputStride = 8;
      const segmentationThreshold = 0.7;
      const segmentation = await net.estimatePersonSegmentation(videoRef.current, outputStride, segmentationThreshold)

      let backgroundBlurAmount = enableBlur ? blurAmount : 0;
      const edgeBlurAmount = 3;
      const flipHorizontal = true;

      bodyPix.drawBokehEffect(
        canvasRef.current,
        videoRef.current,
        segmentation,
        backgroundBlurAmount,
        edgeBlurAmount,
        flipHorizontal
      )

      requestAnimationFrame(() => {
        processVideo(net)
      })
    } catch (err) {
      console.log(err);
    }
  }

  /* <------^^^^^^^------------ Face Blur ------------^^^^^^^^---------> */
  // console.log(props.localStream)

  return (
    <div className="app">

      <video ref={videoRef} playsInline muted height={videoHeight} width={videoWidth} hidden={true} />
      <canvas ref={canvasRef} height={videoHeight} width={videoWidth} />

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
          <p>{connectionStatus}</p>
          <button
            onClick={retry}
            disabled={connectionStatus === "connected" || !start}
          >
            retry
          </button>
        </div>
      )}
    </div>
  );
}