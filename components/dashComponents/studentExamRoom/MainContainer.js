import React, { useState } from 'react'
import VideoContainer from './VideoContainer'
import Script from 'next/script'
import ScreenShareTest from '../../WebRTC/ScreenShareTest'
import { Paper } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import Image from 'next/dist/client/image'
import ExamQuestion from '../../../src/Images/ExamQuestionMath.png'

const useStyles = makeStyles({
  examInformation: {
    height: 200,
    padding: 10
  },
  timer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 200
  },
  videoStream: {
    display: 'flex',
    justifyContent: 'center',
    padding: 10,
    height: 480
  },
  screenShare: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 421,

  },
  answerBox: {
    // height: 700,
    padding: 10
  },
  answerButton: {
    display: 'flex',
    paddingTop: 10,
    justifyContent: 'flex-end'
  },
  connectionStatus: {
    marginTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  connectionGood: {
    color: 'green'
  },
  connectionBad: {
    color: '#d32f2f'
  },
  examQuestion: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 50,
  }
})

export default function MainContainer(props) {
  const [screenStream, setScreenStream] = useState();
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const classes = useStyles(props);

  return (
    <div>
      {/* Note from Evan: load tensorflow for video processing. */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0"></Script>
      <div>
        <Grid container component="main" spacing={1}>
          <CssBaseline />
          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Typography variant="h3" align="center">Exam Room</Typography>
            </Paper>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper variant='outlined' className={classes.videoStream}>
              <VideoContainer
                studentId='123454'
                screenStream={screenStream}
                setConnectionStatus={setConnectionStatus}
              />
            </Paper>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper variant='outlined' className={classes.screenShare}>
              <ScreenShareTest setScreenStream={setScreenStream} />
            </Paper>
            <Paper variant='outlined' className={classes.connectionStatus}>
              <p>Connection Status: <span className={connectionStatus === "connected" ? classes.connectionGood : classes.connectionBad}>
                {connectionStatus}</span>
              </p>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper variant='outlined' className={classes.examInformation}>
              <Typography variant="h6">
                Exam: MATH1001 Mathematical Modelling 1
              </Typography>
              <Typography variant="h6">
                Session: Spring 2021
              </Typography>
              <Typography variant="h6">
                Tutorial: 124A Mrs Jackson
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4} >
            <Paper variant='outlined' className={classes.examInformation}>
              <Typography variant="h6" align='center'>
                Announcements
              </Typography>
              {/* <Typography variant="body1" align='center'>
              
              </Typography> */}
              <ul>
                <li>Anouncement 1</li>
                <li>Anouncement 2</li>
                <li>Anouncement 3</li>
                <li>Anouncement 4</li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2} >
            <Paper variant='outlined' className={classes.timer}>
              <Typography variant="h4" align='center'>
                115m 25s
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper variant='outlined' className={classes.timer}>
              <Typography variant="h6" align='center'>
                Warnings: 1
              </Typography>
              <Typography variant="h6" align='center'>
                Alerts: 2
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant='outlined' className={classes.answerBox}>
              {/* <h1>Question</h1> */}
              <Typography variant="h4" align='center'>Question Section</Typography>
              <div className={classes.examQuestion}>
                <Image src={ExamQuestion}/>
              </div>
              <Typography variant='h6'>Write Your Answer Here</Typography>
              <TextField
                id="outlined-multiline-static"
                label="Answer"
                multiline
                rows={50}
                fullWidth
                variant='outlined'
                // defaultValue="Write answer in here"
                placeholder='Write answer in here'
              />
              <div className={classes.answerButton}>
                <Button variant='contained'>
                  Submit
                </Button>
              </div>
            </Paper>
          </Grid>

        </Grid>

      </div>
    </div>
  )
}
