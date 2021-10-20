import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import {
  collection, addDoc, doc, updateDoc, getDocs, setDoc, deleteDoc,
  getFirestore, onSnapshot, deleteField,
} from "firebase/firestore";
import InvigRTCControls from './InvigRTCControls';

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
  const pc = new RTCPeerConnection(servers);
  const [isStart, setStart] = useState(false);
  const callDoc = doc(firestore, `students/${props.studentId}/Exam`, 'call');
  // const callDoc = doc(firestore, `users/jGfA2AthjJgf0LzBoUwTOOUGDXl2/Exam`, 'call');
  // const callDoc = doc(firestore, `subjects/MAT100/call`, JSON.stringify(props.studentId));
  const answerCandidates = collection(callDoc, "answerCandidates")
  const offerCandidates = collection(callDoc, "offerCandidates")
  const [localAudio, setLocalAudio] = useState();
  const [connectionStatus, setConnectionStatus] = useState(pc.connectionState);
  const [isRetry, setRetry] = useState(true);
  const [isLocalMute, setLocalMute] = useState(false);
  // Ref for the remote video
  const remoteRef = useRef();
  // Ref for the screen share
  const screenRef = useRef();

  // ------------------------ Setup Recording --------------------------
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [mediaRecorder2, setMediaRecorder2] = useState(null)
  let videoOptions = { mimeType: "video/webm; codecs=vp9" };

  useEffect(() => {
    const identifier = "video"
    processRecording(mediaRecorder, identifier)
  }, [mediaRecorder]);

  useEffect(() => {
    const identifier = "screen"
    processRecording(mediaRecorder2, identifier)
  }, [mediaRecorder2]);

  

  // Useeffect to fire every time isMute is changed
  useEffect(() => {
    if (isStart && connectionStatus === "connected")
      toggleMuteAll(props.isMute)
  }, [props.isMute])

  // useEffect to call setupsources on start
  useEffect(() => {
    setupSources()
  }, [])

  // When start button is pressed, setup the RTC connection and create an offer
  const setupSources = async () => {
    // Start button was clicked
    setStart(true);
    // Let user know new connection has been started
    props.setConnectionStatus('New Offer Created')
    // Create audio stream for invigilator
    const localAudio = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setLocalAudio(localAudio);
    // const remoteStream = new MediaStream();
    localAudio.getTracks().forEach((track) => {
      track.enabled = false;
      pc.addTrack(track, localAudio);
    });
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
    // pc.addTransceiver('audio')
    pc.addTransceiver('video')
    // When the student adds a new track to the connection, add this to our remote stream
    pc.ontrack = (event) => {
      let i = 1;
      event.streams[0].getTracks().forEach((track) => {
        // console.log("remote track added!!")
        if (i % 3) {
          // console.log(track)
          remoteStream.addTrack(track);
        } else {
          screenStream.addTrack(track);
        }
        i++;
      });
    };
    // Ref for remote video
    remoteRef.current.srcObject = remoteStream;
    // Ref for screen share
    screenRef.current.srcObject = screenStream;
    // When there is a new ice candidate, add it to the offer candidates
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
      // Allow retry in 10 seconds
      setTimeout(() => { setRetry(false) }, 10000);
    });

    //When the connection changes(e.g disconnect) try to reconnect
    pc.onconnectionstatechange = (event) => {
      console.log(pc.connectionState)
      setConnectionStatus(pc.connectionState);
      props.setConnectionStatus(pc.connectionState);
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

  // Allow for invigillator to unmute one student
  const toggleMute = () => {
    localAudio.getAudioTracks()[0].enabled = !localAudio.getAudioTracks()[0].enabled;
    setLocalMute(localAudio.getAudioTracks()[0].enabled);
    console.log(localAudio.getAudioTracks()[0].enabled);
  }

  // Allow for invigilator to unmute all students
  const toggleMuteAll = (isMute) => {
    localAudio.getAudioTracks()[0].enabled = isMute;
    setLocalMute(localAudio.getAudioTracks()[0].enabled);
    console.log(localAudio.getAudioTracks()[0].enabled);
  }

  // ----------------- Stream Recording--------------------

  function recordVideo() {
    if (!isRecording) {
      setMediaRecorder(new MediaRecorder(remoteRef.current.srcObject, videoOptions))
      setMediaRecorder2(new MediaRecorder(screenRef.current.srcObject, videoOptions))
    } else if (isRecording == true) {
      mediaRecorder.stop();
      mediaRecorder2.stop();
    }
  }

  function processRecording(mediarecorder, identifier) {
    if (mediarecorder) {
      let timeStamp = getTimeStamp();
      mediarecorder.start();
      let recordedChunks = [];
      mediarecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      });
      mediarecorder.addEventListener("stop", () => {
        let blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        if (identifier == "video")
          a.download = `${timeStamp}_video.webm`;
        else if (identifier == "screen")
          a.download = `${timeStamp}_screen.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        resetRecorder();
      });
      setIsRecording(true)
    }
  }

  function getTimeStamp() {
    let newDate = new Date()
    let date = checkZero(newDate.getDate());
    let month = checkZero(newDate.getMonth() + 1);
    let year = checkZero(newDate.getFullYear());
    let hours = checkZero(newDate.getHours());
    let minutes = checkZero(newDate.getMinutes());
    let seconds = checkZero(newDate.getSeconds());

    function checkZero(digits) {
      if (digits < 10)
        return `0${digits}`
      return digits
    }

    return `${year}${month}${date}${hours}${minutes}${seconds}`
  }

  function resetRecorder() {
    setMediaRecorder(null)
    setMediaRecorder2(null)
    setIsRecording(false)
  }

  return (
    <div>
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        style={{ width: 400, backgroundColor: '#555' }}
      />

      <video
        ref={screenRef}
        autoPlay
        playsInline
        style={{ width: 400, backgroundColor:'#555' }}
      />

      <InvigRTCControls
        start={setupSources}
        retry={retry}
        toggleMute={toggleMute}
        isLocalMute={isLocalMute}
        // isStart={isStart}
        isRetry={isRetry}
        connectionStatus={connectionStatus}
        recordVideo={recordVideo}
        isRecording={isRecording}
      />
    </div>
  );
};

