import React from 'react'
import dynamic from 'next/dynamic'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedFlag } from '@material-ui/icons';
import InvigOverview from './InvigOverview';
// import styles from './InvigComponentStyles.module.css'

const TestRTC = dynamic(() => import('./TestRTC'), { ssr: false });

const useStyles = makeStyles({
  root: {
    padding: 30,
    display: 'flex'
  },
  picture: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
  studentInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  tools: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 200,
    paddingLeft: 25,
    paddingRight: 25,
  }
});

export default function ComponentContainer(props) {
  const classes = useStyles(props);
  return (
    <div>
      <Paper className={classes.root} variant="outlined">
        {/* <div className={classes.studentInfo}>
          <img src="https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg"
            className={classes.picture} />
          <div>
            <p>Name: Morpheus</p>
            <p>SID: 121212</p>
          </div>
        </div>
        <div className={classes.tools}>
          <p>Overview</p>
          <p>Warnings: 2</p>
          <p>Notications: 1</p>
          <button>View Logs</button>
          <button>Message</button>
        </div> */}
        <InvigOverview
          name={'Morpheus'}
          studentId={121212}
          image={"https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg"}
        />
        <TestRTC 
          studentId={props.studentId}
          subject={props.subject}
        />
      </Paper>
    </div>
  )
}
