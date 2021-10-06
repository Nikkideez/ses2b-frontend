import React from 'react'
// import dynamic from 'next/dynamic'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import InvigOverview from './InvigOverview';
import InvigRTC from './InvigRTC';
// This file was created to hardcode rtc components as a server needs to be built to handle multiconnection


// const InvigRTC = dynamic(() => import('./InvigRTC'), { ssr: false });

const useStyles = makeStyles({
  root: {
    padding: 30,
    display: 'flex',
    width: 653
  },
});

export default function ComponentContainer(props) {
  const classes = useStyles(props);
  const studentId = props.studentId;
  const subject = props.subject;
  const image = props.image;
  const name = props.name;
  return (
    <div>
      <Paper className={classes.root} variant="outlined">
        <InvigOverview 
        name={name} 
        studentId={studentId}
        image={image}
        />
        <InvigRTC
          studentId={props.studentId}
          subject={props.subject}
          rtc={props.rtc}
        />
      </Paper>
    </div>
  )
}
