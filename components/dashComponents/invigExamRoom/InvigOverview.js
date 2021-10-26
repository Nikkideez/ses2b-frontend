import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import InvigDialog from './InvigDialog';
import { HighlightOff } from '@material-ui/icons';
import { theme, themeTwo } from '../../../src/theme';
import { Avatar, Typography } from '@material-ui/core';
import axios from 'axios';

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
    paddingTop: 10,
    // paddingBottom: 10,
  },
  button: {
    justifyContent: 'flex-start',
    color: '#E9E9E9',
    backgroundColor: '#4259d4'
  },
  buttonSpacing: {
    marginTop: 8,
    marginBottom: 8
  },
  connectionGood: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  connectionBad: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: '14px'
    
  },
  studentName:{
    color: themeTwo.palette.text.title,
    textAlign: 'center',
    marginTop:'10px',
    opacity:'0.9'
  },
  rootText:{
    color: themeTwo.palette.text.title,
    opacity:'0.9'
  }
});

export default function InvigTools(props) {
  const classes = useStyles(props);
  const [warnings, setWarning] = useState(props.warnings);

  function assignWarning() {
    axios({
      method: "POST",
      url: `https://protoruts-backend.herokuapp.com/student/addstrike/${props.examID}/${props.studentId}`,
      withCredentials: true,
    }).then((res) => {
      return res.data;
    })
  }

  const warningHandler = () => {
    if (confirm("Are you sure you want to give a warning?"))
      assignWarning()
      setWarning(warnings + 1)
  }

  return (
    <div className={classes.root}>
      <Avatar className={classes.picture}>{props.name[0][0] + props.name[1][0]}</Avatar>
      <div >
        <Typography variant='subtitle2' className={classes.studentName}>{props.name[0] + " " + props.name[1]}</Typography>
        <p className={classes.rootText}>SID: {props.studentId}</p>
        <p style={{color: themeTwo.palette.text.title, fontSize: '12px', opacity:'0.9'}}>{"Connection Status"}<br/>
        <span className={props.connectionStatus === "connected" ? classes.connectionGood : classes.connectionBad}>
          { props.connectionStatus }
        </span>
        </p>
        <p style={{color: themeTwo.palette.text.title, opacity:'0.9'}}>{"Warnings: \u00A0\u00A0"} <span style={{ color: '#d32f2f', }}>{warnings}</span></p>
      </div>
      <div className={classes.tools}>
        <div className={classes.buttonSpacing}>
          {/* <Badge badgeContent={4} color="secondary" style={{ display: 'block' }}> */}
            <InvigDialog
              name={props.name}
              studentId={props.studentId}
              image={props.image}
              token={props.token}
              examID={ props.examID }
            />
          {/* </Badge> */}
        </div>
        <div >
          <Button 
            variant='outlined'
            className={classes.button}
            startIcon={<WarningIcon style={{ color: 'orange' }} />}
            fullWidth={true}
            onClick={() => warningHandler()}
          >
            {"\u00A0+Warning"}
          </Button>
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
