import React, { useRef, useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import {
  collection, addDoc, doc, updateDoc, getDoc, getDocs, setDoc, deleteDoc,
  getFirestore, onSnapshot, deleteField,
} from "firebase/firestore";
import { async } from '@firebase/util';


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

const pc = new RTCPeerConnection(servers);

function InvigRTC() {
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="app">
      {/* {currentPage === "home" ? (
        <Menu
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          setPage={setCurrentPage}
        />
      ) : ( */}
      <Videos
        mode={currentPage}
        callId={joinCode}
        setPage={setCurrentPage}
      />
      {/* )} */}
    </div>
  );
}

function Menu({ joinCode, setJoinCode, setPage }) {
  return (
    <div className="home">
      <div className="create box">
        <button onClick={() => setPage("create")}>Create Call</button>
      </div>

      <div className="answer box">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Join with code"
        />
        <button onClick={() => setPage("join")}>Answer</button>
      </div>


    </div>
  );
}

function Videos({ mode, callId, setPage }) {
  const [start, setStart] = useState(true);
  const [roomId, setRoomId] = useState(callId);
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);
  const [isRetry, setRetry] = useState(true);
  // const [sender, setSender] = useState(callId);

  const localRef = useRef();
  const remoteRef = useRef();

  const getId = async () => {
    // Get the call ID from firebase
    // CallId should be created in db when student agrees to T&C
    const callCollec = await getDocs(collection(firestore, "calls"));
    callCollec.forEach((doc) => {
      callId = doc.id;
      setRoomId(doc.id);
    })
  }

  useEffect(() => {
    getId();
  }, []);

  const setupSources = async () => {
    // Get the call ID from firebase
    // CallId should be created in db when student agrees to T&C
    // const callCollec = await getDocs(collection(firestore, "calls"));
    // callCollec.forEach((doc) => {
    //   callId = doc.id;
    //   setRoomId(doc.id);
    // })

    // Create a new stream to add the remote stream to
    const remoteStream = new MediaStream();

    // Allow invigilator to recieve video and audio tracks in connection
    pc.addTransceiver('video')
    pc.addTransceiver('audio')

    // When the student adds a new track to the connection, add this to our remote stream
    pc.ontrack = (event) => {
      // console.log("ontrack working!!")
      event.streams[0].getTracks().forEach((track) => {
        console.log("remote track added!!")
        remoteStream.addTrack(track);
      });
    };

    remoteRef.current.srcObject = remoteStream;

    setStart(false);

    // if (mode === "create") {
    //   const callDoc = doc(collection(firestore, "calls"));
    //   const offerCandidates = collection(callDoc, "offerCandidates");
    //   const answerCandidates = collection(callDoc, "answerCandidates");

    //   setRoomId(callDoc.id);
    //   callId = callDoc.id;
    //   pc.onicecandidate = (event) => {
    //     event.candidate &&
    //       addDoc(offerCandidates, (event.candidate.toJSON()));
    //   };

    //   const offerDescription = await pc.createOffer();
    //   await pc.setLocalDescription(offerDescription);

    //   const offer = {
    //     sdp: offerDescription.sdp,
    //     type: offerDescription.type,
    //   };

    //   await setDoc(callDoc, { offer });

    //   onSnapshot(callDoc, (snapshot) => {
    //     const data = snapshot.data();
    //     console.log(pc.connectionState + " " + data?.answer);
    //     // console.log(pc)
    //     if (!pc.currentRemoteDescription && data?.answer) {
    //       pc.setRemoteDescription(data.answer)
    //     }
    //     else if (pc.connectionState === "disconnected" && data?.answer) {
    //       pc.setRemoteDescription(data.answer)
    //       pc.restartIce();
    //       console.log("new remote description!!");
    //     }
    //   });

    //   onSnapshot(answerCandidates, (snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //       if (change.type === "added") {
    //         const candidate = new RTCIceCandidate(
    //           change.doc.data()
    //         );
    //         pc.addIceCandidate(candidate);
    //       }
    //     });
    //   });
    // } else if (mode === "join") {
    const callDoc = doc(firestore, "calls", roomId);
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    // setRoomId(callDoc.id);
    // callId = callDoc.id;
    await updateDoc(callDoc, {
      answer: deleteField(),
      offer: deleteField(),
    });

    pc.onicecandidate = (event) => {
      event.candidate &&
        addDoc(offerCandidates, (event.candidate.toJSON()));
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });


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

      //allow retry in 10 seconds
      setTimeout(() => {setRetry(false)}, 10000);

    });


    // function to create a new offer during disconnect

    // const reconnect = async () => {
    //   console.log("trying to reconnect")
    //   const callDoc = doc(firestore, "calls", callId);
    //   const answerCandidates = collection(callDoc, "answerCandidates");
    //   const offerCandidates = collection(callDoc, "offerCandidates");
    //   //deleting offers, answers and ice candidates to prepare for new connection
    //   await updateDoc(callDoc, {
    //     answer: deleteField(),
    //     offer: deleteField(),
    //   });
    //   const answerAll = await getDocs(answerCandidates);
    //   answerAll.forEach((doc) => {
    //     deleteDoc(doc.ref);
    //   })
    //   const offerAll = await getDocs(offerCandidates);
    //   offerAll.forEach((doc) => {
    //     deleteDoc(doc.ref);
    //   })

    //   const offerDescription = await pc.createOffer();
    //   await pc.setLocalDescription(offerDescription);
    //   console.log(pc.localDescription);

    //   const offer = {
    //     sdp: offerDescription.sdp,
    //     type: offerDescription.type,
    //   };

    //   await setDoc(callDoc, { offer });
    // }

    //When the connection changes(e.g disconnect) try to reconnect
    pc.onconnectionstatechange = (event) => {
      console.log(pc.connectionState)
      setConnectionStatus(pc.connectionState);
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        retry();
      }
    };

  };

  const retry = async () => {
    setRetry(true);
    setTimeout(() => {setRetry(false)}, 10000);
    console.log("reconnecting!!!!")
    console.log(roomId);
    const callDoc = doc(firestore, "calls", roomId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");
    //deleting offers, answers and ice candidates to prepare for new connection
    await updateDoc(callDoc, {
      answer: deleteField(),
      offer: deleteField(),
    });
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

      <div className="buttonsContainer">
        <p>{connectionStatus}</p>
        {/* {console.log(pc.connectionState)}
        {connectionStatus === "connected" ?
          <p>Connection working</p>
          :
          <p>Disconnected</p>
        } */}
        {/* <button
          onClick={hangUp}
          disabled={start}
          className="hangup button"
        >
          hang up
        </button> */}

        {/* <div className="popover">
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              { console.log(roomId) }
            }}
          >
            Copy joining code

          </button>
        </div> */}

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

export default InvigRTC;