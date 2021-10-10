import React from 'react'
import { IconButton } from '@material-ui/core'
import { PlayCircleOutline } from '@material-ui/icons';
import { Replay } from '@material-ui/icons';
import { VolumeUp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  muteOn: {
    color: '#d32f2f'
  },
  muteOff: {

  }
});

export default function InvigRTCControls(props) {
  const classes = useStyles(props);

  return (
    <div style={{ display: 'flex', justifyContent: "space-between" }}>

      <IconButton color="secondary" onClick={props.retry} disabled={props.isRetry || props.connectionStatus === "connected" || props.connectionStatus === "connecting"}>
        <Replay />
      </IconButton>
      {/* <IconButton onClick={props.start} disabled={props.isStart}>
          <PlayCircleOutline />
        </IconButton> */}

      <IconButton onClick={props.toggleMute}>
        <VolumeUp className={props.isLocalMute ? classes.muteOn : classes.muteOff} />
      </IconButton>
    </div>
  )
}
