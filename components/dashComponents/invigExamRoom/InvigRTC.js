import React, { useRef, useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import {
  collection, addDoc, doc, updateDoc, getDocs, setDoc, deleteDoc,
  getFirestore, onSnapshot, deleteField,
} from "firebase/firestore";
// import { async } from '@firebase/util';


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


try {
  initializeApp(firebaseConfig);
} catch {
  console.log("nevermind nothing")
}

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



export default function InvigRTC(props) {
  let pc = props.rtc;
  const [start, setStart] = useState(false);
  const [callDoc, setCallDoc] = useState();
  const [answerCandidates, setAnswerCandidates] = useState();
  const [offerCandidates, setOfferCandidates] = useState();
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);
  const [isRetry, setRetry] = useState(true);

  // Ref for the remote video
  const remoteRef = useRef();
  // Ref for the screen share
  const screenRef = useRef();
  // Constructor for documents paths
  useEffect(() => {
    const callDoc = doc(firestore, `students/${props.studentId}/${props.subject}`, 'call');
    setCallDoc(callDoc);
    setAnswerCandidates(collection(callDoc, "answerCandidates"));
    setOfferCandidates(collection(callDoc, "offerCandidates"));
    setStart(true);
  }, []);

  // When start button is pressed, setup the RTC connection and create an offer
  const setupSources = async () => {
    // console.log(pc.localDescription)
    // if(pc.localDescription)
    //   pc = new RTCPeerConnection(servers);
    // console.log(pc.localDescription)
    // Delete all answer candidates
    const answerAll = await getDocs(answerCandidates);
    answerAll.forEach((doc) => {
      deleteDoc(doc.ref);
    })
    // Delete all offer candidates
    const offerAll = await getDocs(offerCandidates);
    offerAll.forEach((doc) => {
      deleteDoc(doc.ref);
    })
    // Create a new stream to add the remote stream to
    const remoteStream = new MediaStream();
    const screenStream = new MediaStream();
    // Allow invigilator to recieve video and audio tracks in connection
    pc.addTransceiver('video')
    pc.addTransceiver('audio')
    pc.addTransceiver('video')
    // When the student adds a new track to the connection, add this to our remote stream
    pc.ontrack = (event) => {
      let i = 1;
      event.streams[0].getTracks().forEach((track) => {
        console.log("remote track added!!")
        if (i % 3) {
          // console.log(track)
          remoteStream.addTrack(track);
        } else {
          screenStream.addTrack(track);
        }
        i++;
      });
      // console.log(pc.getTransceivers());
      // console.log(pc.getReceivers());
    };
    // Ref for remote video
    remoteRef.current.srcObject = remoteStream;
    // Ref for screen share
    screenRef.current.srcObject = screenStream;
    console.log(remoteRef);
    console.log(screenRef);
    // Start button was clicked
    setStart(false);
    // Where there is a new ice candidate, add it to the offer candidates
    pc.onicecandidate = (event) => {
      event.candidate &&
        addDoc(offerCandidates, (event.candidate.toJSON()));
    };
    // Create the offer sdp and set as local
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    // Send offer to database
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await setDoc(callDoc, { offer });
    // Even listener for when the document is updated with an answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      console.log(pc.connectionState + " " + data?.answer);
      if (!pc.currentRemoteDescription && data?.answer) {
        pc.setRemoteDescription(data.answer)
        console.log("remote set!!!!!")
      }
      else if (pc.connectionState === "disconnected" && data?.answer) {
        pc.restartIce();
        pc.setRemoteDescription(data.answer)
        console.log("new remote description!!");
      }
    });
    // Event listener for answer ice candidates
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(
            change.doc.data()
          );
          try {
            // console.log("Going to add ice candidates!")
            pc.addIceCandidate(candidate).catch(function (err) {
              console.log("Delete this icecandidate from database");
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
      // Allow retry in 8 seconds
      setTimeout(() => { setRetry(false) }, 8000);
    });

    //When the connection changes(e.g disconnect) try to reconnect
    pc.onconnectionstatechange = (event) => {
      console.log(pc.connectionState)
      setConnectionStatus(pc.connectionState);
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        retry();
      }
    };
  };

  // Retry connection by clearing database and creating new offer
  const retry = async () => {
    // Disable the retry button for 8 seconds so multiple offers are not executed
    // Spamming retry will most likely make reconnecting difficult
    setRetry(true);
    setTimeout(() => { setRetry(false) }, 8000);
    console.log("reconnecting!!!!")
    //deleting offers, answers and ice candidates to prepare for new connection
    const answerAll = await getDocs(answerCandidates);
    answerAll.forEach((doc) => {
      deleteDoc(doc.ref);
    })
    const offerAll = await getDocs(offerCandidates);
    offerAll.forEach((doc) => {
      deleteDoc(doc.ref);
    })
    console.log("finished deleting")
    //create a new offer so the student can create a new answer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await setDoc(callDoc, { offer });
  }

  return (
    <div>
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        style={{ width: 400 }}
      />

      <video
        ref={screenRef}
        autoPlay
        playsInline
        style={{ width: 400 }}
      />

      <div className="buttonsContainer">
        <p>{connectionStatus}</p>
      </div>

      {start ? (
        <div>
          <button onClick={setupSources}>Start</button>
        </div>
      ) : (
        <div>
          <button
            onClick={retry} disabled={isRetry || connectionStatus === "connected"}>retry</button>
        </div>
      )}
    </div>
  );
}


