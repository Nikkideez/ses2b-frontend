import React, { useState, useRef, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import InvigOverview from './InvigOverview';
import InvigRTC from './InvigRTC';
import { themeTwo } from '../../../src/theme';

const useStyles = makeStyles({
  root: {
    padding: 15,
    display: 'flex',
    width: 'min-content',
    backgroundColor: themeTwo.palette.primary.main
  },

});

export default function ComponentContainer(props) {
  const classes = useStyles(props);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  return (
    <div>
      <Paper className={classes.root} variant="outlined">
        <InvigOverview
          name={props.name}
          studentId={props.studentId}
          image={props.image}
          connectionStatus={connectionStatus}
          examID={ props.examID }
        />
        <InvigRTC
          studentId={props.studentId}
          subject={props.subject}
          // rtc={props.rtc}
          setConnectionStatus={setConnectionStatus}
          isMute={props.isMute}
        />
      </Paper>
    </div>
  )
}
