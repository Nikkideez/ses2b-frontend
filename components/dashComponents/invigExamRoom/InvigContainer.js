import React, { useState, useRef, useEffect } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDocs, getFirestore, onSnapshot,
  deleteField, query, where
} from "firebase/firestore";
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
  const [student, setStudent] = useState()

  const firestore = getFirestore();

  useEffect(() => {
    getStudentDetail()
  }, [])

  async function getStudentDetail() {
    const q = query(collection(firestore, 'users'), where('student_id', "==" , parseInt(props.studentId)))
    
    let querySnapshot = await getDocs(q);
    // let students = []
    // let querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setStudent(doc.data())
    })

    //  let querySnapshot = await getDocs(q)
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.data())
    //             students.push(doc.data())   
    //         })
    //         console.log(students)
    //         return {exam: data, students: students}
    // console.log(students)
  }

  return (
    <div>
      {/* <button onClick={ props.studentId }>tesssst</button> */}
      {student ?
        <Paper className={classes.root} variant="outlined">
          <InvigOverview
            name={[student.first_name, student.last]}
            studentId={props.studentId}
            image={props.image}
            connectionStatus={connectionStatus}
            examID={props.examID}
            warnings={props.warnings}
            token={ props.token }
          />
          <InvigRTC
            studentId={props.studentId}
            subject={props.subject}
            // rtc={props.rtc}
            setConnectionStatus={setConnectionStatus}
            isMute={props.isMute}
            />
        </Paper>
            : null}
    </div>
  )
}
