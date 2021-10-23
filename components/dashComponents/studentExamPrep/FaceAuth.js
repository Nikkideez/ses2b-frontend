import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import styles from '../../../styles/Face.module.css';
import Router, { useRouter } from "next/router";
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Fallback from './Fallback';

let canvasRef;
let videoRef;
let floatArray;
let working;

//pass prop for next page - props.nextPage (e.g. <Face nextPage = "/about" id = "1"/>)
function Face(props) {
  videoRef = useRef();
  canvasRef = useRef();

  const videoHeight = 360;
  const videoWidth = 480;

  const isConfirm = true;
  const message = "Are you sure?";
  let isMounted = true;
  const router = useRouter();
  let Photo;
  let user;

  const [feedback, setFeedback] = useState();
  const [showFallback, setShowFallback] = useState();

  // Temporary array for face descriptors
  // let tempDescriptors = [-0.0748710185289383,0.08677951991558075,0.047674745321273804,0.001281119417399168,-0.0006739108357578516,-0.09275844693183899,-0.01897650957107544,-0.09543469548225403,0.09200802445411682,-0.019883863627910614,0.22106029093265533,-0.08845405280590057,-0.20776160061359406,-0.13971665501594543,-0.07144319266080856,0.17485903203487396,-0.16610634326934814,-0.0763217955827713,-0.046095989644527435,0.021790552884340286,0.15591417253017426,-0.04744250699877739,0.03775927424430847,0.062228359282016754,-0.1166132241487503,-0.24904917180538177,-0.07949032634496689,-0.07315200567245483,-0.06114910542964935,-0.055112652480602264,-0.055002156645059586,0.07599703967571259,-0.22507676482200623,-0.11923924088478088,0.016795475035905838,0.09385276585817337,-0.027476362884044647,-0.03908594697713852,0.15611878037452698,0.005595828406512737,-0.15070512890815735,-0.02466941997408867,0.039658330380916595,0.24074116349220276,0.19590990245342255,0.014362430199980736,0.0008804835379123688,-0.09337147325277328,0.11170986294746399,-0.18012401461601257,-0.005515620112419128,0.12401848286390305,0.1317959427833557,0.10018514096736908,-0.009363657794892788,-0.0824584886431694,0.08764363825321198,0.15029625594615936,-0.17998333275318146,0.010072719305753708,0.048392292112112045,-0.10793130099773407,-0.04688788205385208,-0.05464734137058258,0.16333062946796417,0.07141260802745819,-0.10340125858783722,-0.1680619716644287,0.09970616549253464,-0.1022515669465065,-0.05883565545082092,0.09678752720355988,-0.13968288898468018,-0.19539490342140198,-0.334941029548645,0.016737263649702072,0.3482382595539093,0.09052807092666626,-0.21452440321445465,0.0018774056807160378,-0.031091563403606415,0.0015243031084537506,0.13318322598934174,0.11109992116689682,-0.017183817923069,0.07402937859296799,-0.12171953916549683,0.010933298617601395,0.1446760594844818,-0.06384792923927307,-0.05811748653650284,0.1956675499677658,-0.018954835832118988,0.04613519459962845,0.0356864295899868,-0.0062127187848091125,-0.035524677485227585,0.07630638778209686,-0.1623435914516449,-0.00969485193490982,0.03783771023154259,-0.040819332003593445,-0.02117016538977623,0.08193362504243851,-0.07337342202663422,0.04371294379234314,-0.0011358712799847126,0.03785676881670952,-0.034556783735752106,-0.08287299424409866,-0.15719854831695557,-0.05208317190408707,0.0963154062628746,-0.19543422758579254,0.14075161516666412,0.14990530908107758,0.012372609227895737,0.050627708435058594,0.1023646891117096,0.08780945092439651,-0.014630422927439213,-0.020412206649780273,-0.17678308486938477,0.022166043519973755,0.15635177493095398,0.004937633406370878,0.09215621650218964,-0.0709625855088234]
  
  useEffect(() => {
    async function fetchFaceDescription() {
      const faceDescription = await getFaceDescription(props.token)
      if (faceDescription.length === 0) {
        setFeedback("No refrence image detected. Please contact admin.")
      } else {
        floatArray = Float32Array.from(faceDescription.replace(/, +/g, ",").split(",").map(Number))
        loadModels();
      }
    }
    fetchFaceDescription()

    // handle exit page
    Router.events.on("routeChangeStart", handler);

    return () => {
      Router.events.off("routeChangeStart", handler);
    };
  }, [])

  async function getFaceDescription(token) {
    const user = await axios({
        method: "POST",
        url: "https://protoruts-backend.herokuapp.com/student/get-face-description",
        data: {
            idToken: token
        },
        withCredentials: true,
    }).then((res) => {
        return res.data;
    })

    const returnUser = async () => {
        const userDetail = await user;
        return userDetail;
    }

    return returnUser();
}

  const loadModels = async() => {
      Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('./../../models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./../../models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('./../../models'),
      ]).then(startVideo);
  }

  // handle exit page
  const handler = () => {
    if (isMounted) {
        if (isConfirm && !window.confirm(message)) {
          throw "Route Canceled";
        } else {
          isMounted = false;
          stopCamera();
        }
    }
  };

  const startVideo = () => {
    //get webcam
    if (isMounted == true) {
      navigator.mediaDevices.getUserMedia({
        video: {}
      }).then((stream) => {

        //stop camera if user left to new page early
        if (!isMounted) {
          const tracks = stream.getTracks();
          tracks.forEach(function (track) {
          track.stop();
        });
        }
        if (stream != null && isMounted == true) {
          videoRef.current.srcObject = stream;
        }
      },
        (err) => err);
    }
  }

  //Face recognition
  const handleVideoOnPlay = async () => {
    let labeledDescriptors = null;
    let faceMatcher = null;
    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
    const displaySize = {
      width: videoWidth,
      height: videoHeight
    }
    faceapi.matchDimensions(canvasRef.current, displaySize);
    try {
      labeledDescriptors = await loadLabeledImages()
      faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4)
    } catch (err) {
      //If catch user is next page
    }

    working = setInterval(async () => {

      let detections = null;
      let resizedDetections = null;

      if (isMounted == false) {
        clearInterval(working)
      }
      // Starting face recognition
      try {
        if (isMounted) {
          detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors()
          resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight)

          const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor)
          })

          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawOptions = {
              lineWidth: 4,
              boxColor: "lime",
            }
            const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
            drawBox.draw(canvasRef.current)
          })

          //unlock
          if (results.length != 0 && results[0].label == "Photo_ID") {
            handleUnlock()
          }
        }
      } catch (err) {
        //If catch user is next page
      }
    }, 100)
  }

  function handleUnlock() {
    clearInterval(working);
    isMounted = false;
    stopCamera();
    props.handleNext();
  }

  //Image for model
  const loadLabeledImages = () => {
    const labels = ['Photo_ID']
    return Promise.all(
      labels.map(async (label) => {
        let detections = null;
        const descriptions = []

        //load face descriptions
        if (isMounted == true) {
          descriptions.push(floatArray)
          return new faceapi.LabeledFaceDescriptors(label, descriptions)
        }
        return null;
      })
    )
  }

  //stop using webcam
  const stopCamera = () => {
    try {
      if (videoRef.current.srcObject != null) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
          track.stop();
        });

        videoRef.current.srcObject = null;
      }
    } catch (err) {
      //If catch user is next page
    }
  }


  return (
    <div>
      <div className={styles.display}>
        <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay}/>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.display}>
        <Typography style={{ color: "red" }}>{feedback}</Typography>
        </div>
      <div className={styles.display}>
        <Button onClick={() => setShowFallback(true)}>Cannot Authenticate?</Button>
      </div>
      <div className={styles.display}>
      {showFallback ?
          <Fallback EmailToken={props.EmailToken} token={props.token} handleUnlock={ handleUnlock }/>
        : null
        }
      </div>
    </div>
  );
}

export default Face;