import React, { useRef, useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import {
  collection, addDoc, doc, updateDoc, getDoc, getDocs, setDoc, deleteDoc,
  getFirestore, onSnapshot, deleteField, query
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

function StudentRTC() {
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
    </div>
  );
}

// function Menu({ joinCode, setJoinCode, setPage }) {
//   const autoStart = async () => {
//     const callCollec = await getDocs(collection(firestore, "calls"));
//     callCollec.forEach((doc) => {
//       setJoinCode(doc.id);
//     })
//     setPage("join");
//   }

//   return (
//     <div className="home">
//       <div className="create box">
//         <button onClick={() => setPage("create")}>Create Call</button>
//       </div>

//       <div className="answer box">
//         <input
//           value={joinCode}
//           onChange={(e) => setJoinCode(e.target.value)}
//           placeholder="Join with code"
//         />
//         <button onClick={() => setPage("join")}>Answer</button>
//       </div>

//       <div className="autojoin box">
//         <button onClick={() => autoStart()}>Auto Join</button>
//       </div>


//     </div>
//   );
// }

function Videos({ mode, callId, setPage }) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  const [start, setStart] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);

  const getCall = async () => {
    const callCollec = await getDocs(collection(firestore, "calls"));
    callCollec.forEach((doc) => {
      callId = doc.id;
      setRoomId(doc.id);
    })
    const callDoc = doc(firestore, "calls", callId);
    // const callData = (await getDoc(callDoc)).data();
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      console.log(data?.offer);
      if (data?.offer && !data?.answer) {
        setStart(true);
      } else {
        setStart(false)
      }
    })
    // if(callData.offer)
    //   setStart(true)
  }

  const localRef = useRef();
  useEffect(() => {
    getCall();
  })

  const setupSources = async () => {
    // Get the call ID from firebase
    // CallId should be created in db when student agrees to T&C
    const callCollec = await getDocs(collection(firestore, "calls"));
    callCollec.forEach((doc) => {
      callId = doc.id;
      setRoomId(doc.id);
    })
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // const remoteStream = new MediaStream();
    console.log(pc.connectionState);
    localStream.getTracks().forEach((track) => {
      console.log("adding student track")
      pc.addTrack(track, localStream);
    });

    //video for the local stream that is being sent to invigilator
    localRef.current.srcObject = localStream;

    setWebcamActive(true);
    // Defining the required collections and documents in database
    const callDoc = doc(firestore, "calls", callId);
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
    await pc.setRemoteDescription(offerDescription);
    console.log("remote description set!")

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      console.log(data?.offer);
      if (data?.offer && !data?.answer && pc.connectionState === "disconnected") {
        newAnswer(callDoc, data.offer);
      }
    })

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          try {
            pc.addIceCandidate(new RTCIceCandidate(data));
          } catch (err) {
            console.log(err);
          }

          // console.log(data);
        }
      });
    });
    // }

    // creates a new answer for a new answer when there is a disconnect
    const newAnswer = async (callDoc, offer) => {
      console.log("calling new answer")
      pc.restartIce();
      await pc.setRemoteDescription(offer);
      console.log(pc.signalingState);
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

    // function to create a new offer during disconnect
    const reconnect = async () => {
      console.log("reconnect called!!")
      const callDoc = doc(firestore, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

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

    }



    pc.onconnectionstatechange = (event) => {
      console.log(pc.connectionState)
      setConnectionStatus(pc.connectionState);
      if (pc.connectionState === "disconnected") {
        reconnect();
        // hangUp();
      }
    };
  };

  const retry = async () => {
    const callDoc = doc(firestore, "calls", callId);
    // const answerCandidates = collection(callDoc, "answerCandidates");
    // const offerCandidates = collection(callDoc, "offerCandidates");

    await updateDoc(callDoc, {
      answer: deleteField(),
    });

    // const answerAll = await getDocs(answerCandidates);
    // answerAll.forEach((doc) => {
    //   deleteDoc(doc.ref);
    // })

    // const offerAll = await getDocs(offerCandidates);
    // offerAll.forEach((doc) => {
    //   deleteDoc(doc.ref);
    // })
    // console.log("finished deleting")
  }


  // const hangUp = async () => {
  //   pc.close();

  //   if (roomId) {
  //     let roomRef = doc(firestore, "calls", roomId);
  //     let answerRef = await getDocs(collection(roomRef, "answerCandidates"));
  //     answerRef.forEach((doc) => {
  //       delete (doc.ref);
  //     });
  //     let offerRef = await getDocs(collection(roomRef, "offerCandidates"))
  //     offerRef.forEach((doc) => {
  //       delete (doc.ref);
  //     });

  //     await deleteDoc(roomRef);
  //   }

  //   window.location.reload();
  // };


  return (
    <div className="videos">
      <video
        ref={localRef}
        autoPlay
        playsInline
        className="local"
        muted
      />
      {/* <video
        ref={remoteRef}
        autoPlay
        playsInline
        className="remote" /> */}

      {/* <div className="buttonsContainer">
        <button
          onClick={hangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          hang up
        </button>

        <div className="popover">
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              { console.log(roomId) }
            }}
          >
            Copy joining code

          </button>
        </div>

      </div> */}

      {!webcamActive ? (
        <div className="modalContainer">
          <div className="modal">
            <h3>
              Turn on your camera and microphone and start the
              call
            </h3>
            <div className="container">
              {/* <button
                onClick={() => setPage("home")}
                className="secondary"
              >
                Cancel
              </button> */}
              <button
                onClick={setupSources}
                disabled={!start}
              >Start</button>
            </div>
          </div>
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

export default StudentRTC;