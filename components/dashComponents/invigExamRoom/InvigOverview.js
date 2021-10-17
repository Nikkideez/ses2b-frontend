import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import InvigDialog from './InvigDialog';
import { HighlightOff } from '@material-ui/icons';


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
  },
  connectionGood: {
    color: 'green'
  },
  connectionBad: {
    color: '#d32f2f'
  }
});

export default function InvigTools(props) {
  const classes = useStyles(props);
  const [warnings, setWarning] = useState(2);

  const warningHandler = () => {
    if (confirm("Are you sure you want to give a warning?"))
      setWarning(warnings + 1)
  }
  return (
    <div className={classes.root}>
      <img src={props.image}
        className={classes.picture} />
      <div>
        <p>Student Name: {props.name}</p>
        <p>SID: {props.studentId}</p>
        <p>{"Connection:" + "\n"}<span className={props.connectionStatus === "connected" ? classes.connectionGood : classes.connectionBad}>
          {"\n" + props.connectionStatus }
        </span></p>
        <p>Warnings: <span style={{ color: '#d32f2f' }}>{warnings}</span></p>
      </div>
      <div className={classes.tools}>
        <div >
          <Button
            variant='outlined'
            className={classes.button}
            startIcon={<WarningIcon style={{ color: 'orange' }} />}
            fullWidth={true}
            onClick={() => warningHandler()}
          >
            +Warning
          </Button>
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
        <div className={classes.buttonSpacing}>
          <Button variant='outlined' className={classes.button} startIcon={<HighlightOff />} fullWidth={true}>
            End Exam
          </Button>
        </div>
      </div>
    </div>
  )
}
