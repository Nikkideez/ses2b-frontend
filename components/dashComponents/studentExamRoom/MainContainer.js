import React, { useState, useEffect } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
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
    padding: 20
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
  const [examDetails, setExamDetails] = useState()
  const classes = useStyles(props);
  const studentID = props.studentId
  // const examDetails = onSnapshot(doc(firestore, "exams", props.examID), (doc) => {
  //   console.log("Current data: ", doc.data());
  // });
  
  // Getting firebase
  const firestore = getFirestore();

  useEffect(() => {
    getAnnouncments("7VvK5sOx3TUpmHYAkLSQ")
  }, [])

  async function getAnnouncments(examID) {
    onSnapshot(doc(firestore, "exams", examID), (doc) => {
      console.log("Current data: ", doc.data());
      setExamDetails(doc.data())
    });
  }

  return (
    <div>
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
                studentId={ props.studentId }
                screenStream={screenStream}
                setConnectionStatus={setConnectionStatus}
                token={ props.token }
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
              {examDetails ?
                <div>
                  <Typography variant="h6">
                    Exam: { examDetails.subject }
                  </Typography>
                  <Typography variant="h6">
                    Session: Spring 2021
                  </Typography>
                  <Typography variant="h6">
                    Invigilator: { examDetails.invigilator}
                  </Typography>
                </div>
              : null}
            </Paper>
          </Grid>
          <Grid item xs={6} md={4} >
            <Paper variant='outlined' className={classes.examInformation}>
              <Typography variant="h6" align='center'>
                Announcements
              </Typography>
              <ul>
                {examDetails ?
                  examDetails.announcements.map((announcement, index) =>
                    <div key={index}>
                      <li>{ announcement }</li>
                    </div >)
                  : null}
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
              {examDetails ?
                <Typography variant="h6" align='center'>
                  Warnings: {examDetails.strikes[studentID] }
                </Typography>
              :null }
              {/* <Typography variant="h6" align='center'>
                Warnings: 1
              </Typography>
              <Typography variant="h6" align='center'>
                Alerts: 2
              </Typography> */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant='outlined' className={classes.answerBox}>
              {/* <h1>Question</h1> */}
              <Typography variant="h4" align='center'>Question Section</Typography>
              <div className={classes.examQuestion}>
                <Image src={ExamQuestion}/>
              </div>
              <Typography variant='h6'>Answer Box</Typography>
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
