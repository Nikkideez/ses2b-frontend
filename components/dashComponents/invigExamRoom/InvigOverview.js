import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InvigDialog from './InvigDialog';
import { PlayCircleOutline } from '@material-ui/icons';
import { Replay } from '@material-ui/icons';


const useStyles = makeStyles({
  root: {
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'column'
  },
  picture: {
    width: 150,
    height: 150,
    backgroundColor: 'grey',
  },
  tools: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    width: 150,
    paddingRight: 25,
  },
  toolsContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'grey',
  },
  tools: {
    display: 'flex',
    width: 150,
    flexDirection: 'column',
    paddingTop: 20,
    // paddingBottom: 10,
  },
  button: {
    justifyContent: 'flex-start',
  },
  buttonSpacing: {
    marginTop: 8
  }
  // icon: {
  //   paddingRight: 10,
  // }
});

export default function InvigTools(props) {
  // console.log(props.start)
  const classes = useStyles(props);
  const [isStart, setStart] = useState(false);
  const [warnings, setWarning] = useState(2);
  const startRTC = () => {
    props.start();
    setStart(true);
  }
  const warningHandler = () => {
    if (confirm("Are you sure you want to give a warning?"))
      setWarning(warnings + 1)
  }
  return (
    <div className={classes.root}>
      <img src={props.image}
        className={classes.picture} />
      <div>
        <p>Name: {props.name}</p>
        <p>SID: {props.studentId}</p>
        <p>Connection: <span style={{ color: 'green' }}>{props.connectionStatus}</span></p>
        <p>Warnings: <span style={{ color: '#d32f2f' }}>{warnings}</span></p>
      </div>
      {/* <div className={classes.toolsContainer}>
      </div> */}
      <div className={classes.tools}>
        <div >
          {/* <Badge badgeContent={2} color="secondary" style={{ display: 'block' }} > */}
          <Button
            variant='outlined'
            className={classes.button}
            startIcon={<WarningIcon style={{ color: 'orange' }} />}
            fullWidth={true}
            onClick={() => warningHandler()}
          >
            +Warning
          </Button>
          {/* </Badge> */}
        </div>
        <div className={classes.buttonSpacing}>
          <Badge badgeContent={4} color="secondary" style={{ display: 'block' }}>
            <InvigDialog
              name={props.name}
              studentId={props.studentId}
              image={props.image}
            />
          </Badge>
        </div>
        {/* <div className={classes.buttonSpacing}>
          <Button
            variant='outlined'
            className={classes.button}
            disabled={isStart}
            onClick={() => startRTC()}
            startIcon={<PlayCircleOutline style={{ color: 'green' }} />}
            fullWidth={true}
          >
            Start
          </Button>
        </div>
        <div className={classes.buttonSpacing}>
          <Button
            variant='outlined'
            className={classes.button}
            disabled={props.connectionStatus === 'connected'}
            onClick={() => props.retry()}
            startIcon={<Replay style={{ color: 'blue' }} />}
            fullWidth={true}
          >
            retry
          </Button>
        </div>
        <div className={classes.buttonSpacing}>
          <Button
            variant='outlined'
            className={classes.button}
            disabled={props.connectionStatus !== 'connected'}
            onClick={() => props.toggleMute()}
            startIcon={<Replay style={{ color: 'purple' }} />}
            fullWidth={true}
          >
            Mute
          </Button>
        </div> */}
        <div className={classes.buttonSpacing}>
          <Button variant='outlined' className={classes.button} startIcon={<NotificationsIcon />} fullWidth={true}>
            End Exam
          </Button>
        </div>
        {/* <div>
          <InvigDialog name={props.name} />
        </div> */}
      </div>
    </div>
  )
}
