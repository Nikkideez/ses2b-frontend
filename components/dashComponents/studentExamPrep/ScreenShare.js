import React, { useRef, useState } from "react";
import styles from '../../../styles/Face.module.css';
import Button from '@material-ui/core/Button';

let videoRef;

export function stopScreen() {
  const tracks = videoRef.current.srcObject.getTracks();
  for( var i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
}


export default function ScreenShare(props) {
  videoRef = useRef();
  const videoHeight = 360;
  const videoWidth = 480;

  const [feedback, setFeedback] = useState("")

//   if (adapter.browserDetails.browser == 'firefox') {
//   adapter.browserShim.shimGetDisplayMedia(window, 'screen');
// }
  

  function handleSuccess(stream) {
    startButton.disabled = true;
    // const video = document.querySelector('video');
    videoRef.current.srcObject = stream;

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      errorMsg('The user has ended sharing the screen');
      startButton.disabled = false;
    });
    props.handleDisabled();
  }

  function handleError(error) {
    errorMsg(`getDisplayMedia error: ${error.name}`, error);
  }

  function errorMsg(msg, error) {
    setFeedback(msg);
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  function startButton() {
    navigator.mediaDevices.getDisplayMedia({ video: {}})
        .then(handleSuccess, handleError);
  }



  return (
    <div>
      <div className={styles.display}>
        <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline autoPlay muted />
      </div>
      <div className={styles.display}>
        <Button onClick={() => startButton()}>Start Screen Sharing</Button>
        <p>{feedback}</p>
      </div>
    </div>
  );
}