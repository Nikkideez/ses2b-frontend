import React, { useState, useRef, useEffect } from 'react'
// import dynamic from 'next/dynamic'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import InvigOverview from './InvigOverview';
import InvigRTC from './InvigRTC';
// This file was created to hardcode rtc components as a server needs to be built to handle multiconnection


// const InvigRTC = dynamic(() => import('./InvigRTC'), { ssr: false });

const useStyles = makeStyles({
  root: {
    padding: 15,
    display: 'flex',
    width: 'min-content'
  },
});

export default function ComponentContainer(props) {
  const classes = useStyles(props);
  const [connectionStatus, setConnectionStatus] = useState('new');
  const studentId = props.studentId;
  const subject = props.subject;
  const image = props.image;
  const name = props.name;
  // Ref for functions in invigRTC to be called in other components
  const invigRef = useRef();
  const start = () => invigRef.current.start();
  const retry = () => invigRef.current.retryConnection();
  const toggleMute = () => invigRef.current.toggleMute();
  // console.log(start);

  // const getAudio = async () => {
  //   try {
  //   const localStream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //   });
  //   setAudio(localStream);
  //   console.log(localStream)
  //   }
  //   catch (err){
  //     console.log(err)
  //   }
  // }

  // useEffect(() => {
  //   getAudio();
  // }, [])

  

  return (
    <div>
      <Paper className={classes.root} variant="outlined">
        <InvigOverview
          name={props.name}
          studentId={props.studentId}
          image={props.image}
          connectionStatus={connectionStatus}
          start={start}
          retry={retry}
          toggleMute={toggleMute}
        />
        <InvigRTC
          studentId={props.studentId}
          subject={props.subject}
          rtc={props.rtc}
          setConnectionStatus={setConnectionStatus}
          ref={invigRef}
          localAudio={props.localAudio}
        />
        {/* <button onClick={() => invigRef.current.start()}> start</button> */}
      </Paper>
    </div>
  )
}
