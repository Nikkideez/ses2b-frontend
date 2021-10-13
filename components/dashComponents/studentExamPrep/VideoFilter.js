import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from '@material-ui/core/styles';

let enableBlur = true;
let enableBackground = false;
let blurAmount = 5;
let threshold = 70;
let virtualBackground;

let localStream;

export function stopVideo() {
    localStream && localStream.getTracks().forEach((x) => x.stop());
    localStream = null;
}

const useStyles = makeStyles((theme) => ({
  section: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
  },
  gridTitle: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "padding-top": "25px"
  },
  box: {
    color: "default",
      '&.Mui-checked': {
        color: "#2979FF",
      },
  }
}))

export default function Blur(props) {
  const videoHeight = 480;
  const videoWidth = 640;
  const videoRef = useRef();
  const canvasRef = useRef();
  localStream = useRef();
  const classes = useStyles();

  useEffect(() => {
    const img = new Image();
    img.src = "/logoBG.PNG";
    img.onload = () => {
      virtualBackground = img;
    }

    initializeVideo();
  })

  async function initializeVideo() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: {} })
      if (localStream != null) {
        videoRef.current.srcObject = localStream;
        videoRef.current.play();
        videoRef.current.addEventListener("loadeddata", async () => {
          const net = await bodyPix.load();
          processVideo(net)
        })
      }
    } catch (err){
      stopVideo();
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
    catch (err) { console.log(err)}
  }


  return (
    <div style={{ display: "flex"}}>
      <video ref={videoRef} playsInline muted height={videoHeight} width={videoWidth} hidden={ true }/>
      <Paper variant="outlined" square
          style={{ height: videoHeight, width: videoWidth}}>
        <canvas ref={canvasRef} height={videoHeight} width={videoWidth} />
      </Paper>
      <Paper variant="outlined" square
          style={{ height: videoHeight, width: 300}}>
        <Grid item xs container direction="column" spacing={2}>
          <Paper elevation={0} style={{backgroundColor: 'transparent'}}>
          <Grid item xs={12} className={classes.gridTitle}>
            <Typography style={{ fontWeight: 600, fontSize: 25 }}>
              Settings
            </Typography>
          </Grid>
          </Paper>
          <Grid item xs={12}>
            <Grid item xs container direction="row" spacing={1}>
              <Grid item xs={6} className={classes.section}>
                <Typography>
                  Toggle blur
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <Checkbox
                  id="toggleBlur"
                  type="checkbox"
                  defaultChecked={enableBlur}
                  className={ classes.box }
                  onClick={() => (enableBlur = !enableBlur)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs container direction="row" spacing={1}>
              <Grid item xs={6} className={classes.section}>
                <Typography>
                  Blur Amount
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <input
                  type="range"
                  min={0}
                  max={20}
                  defaultValue={blurAmount}
                  onChange={(e) => (blurAmount = e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs container direction="row" spacing={1}>
              <Grid item xs={6} className={classes.section}>
                <Typography>
                  Accuracy
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={threshold}
                  onChange={(e) => (threshold = e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs container direction="row" spacing={1}>
                <Grid item xs={6} className={classes.section}>
                  <Typography>
                    Background
                  </Typography>
                </Grid>
                <Grid item xs={6} className={classes.section}>
                  <Checkbox
                    id="toggleBlur"
                    type="checkbox"
                    defaultChecked={enableBackground}
                    className={ classes.box }
                    onClick={() => (enableBackground = !enableBackground)}
                  />
                </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.2.0"></Script>
    </div>
  );
}