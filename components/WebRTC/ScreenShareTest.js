import React, { useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import Button from '@material-ui/core/Button'

export default function ScreenShare(props) {

  const videoRef = useRef();
  const videoHeight = 360;
  const videoWidth = 400;

  const [feedback, setFeedback] = useState("")

//   if (adapter.browserDetails.browser == 'firefox') {
//   adapter.browserShim.shimGetDisplayMedia(window, 'screen');
// }
  

  function handleSuccess(stream) {
    props.setScreenStream(stream.getVideoTracks()[0]);
    // console.log(stream.getVideoTracks());
    startButton.disabled = true;
    // const video = document.querySelector('video');
    videoRef.current.srcObject = stream;
    // props.setScreenShare(true);

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      errorMsg('The user has ended sharing the screen');
      startButton.disabled = false;
    });
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
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline autoPlay muted />
      <Button onClick={() => startButton()}>Activate</Button>
      <p>{ feedback }</p>
    </div>
  );
}