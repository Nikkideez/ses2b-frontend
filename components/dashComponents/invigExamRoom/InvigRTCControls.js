import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { PlayCircleOutline } from '@material-ui/icons';
import { Replay } from '@material-ui/icons';
import { VolumeUp, VolumeMute } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import {FiberManualRecord} from '@material-ui/icons';

const useStyles = makeStyles({
  muteOn: {
    color: '#d32f2f'
  },
  muteOff: {

  },

  recordOn: {
    color: '#d32f2f'
  },
  recordOff: {

  }
});

export default function InvigRTCControls(props) {
  const classes = useStyles(props);

  return (
    <div style={{ display: 'flex', justifyContent: "space-between" }}>

      <IconButton color="secondary" onClick={props.retry} disabled={props.isRetry || props.connectionStatus === "connected" || props.connectionStatus === "connecting"}>
        <Replay />
      </IconButton>
      {props.connectionStatus !== "new" ?
        <IconButton onClick={props.recordVideo}>
          <FiberManualRecord className={props.isRecording ? classes.recordOn : classes.recordOff}/>
        </IconButton>
        : null}
      {/* <IconButton onClick={props.start} disabled={props.isStart}>
          <PlayCircleOutline />
        </IconButton> */}
      <Tooltip title = {props.isLocalMute? "unmute" : "mute"}placement="right">
      <IconButton onClick={props.toggleMute}>
        {props.isLocalMute? 
        <VolumeMute className={classes.muteOn}/> : 
        <VolumeUp className={classes.muteOff}/>   }
      </IconButton>
      </Tooltip>
    </div>
  )
}
