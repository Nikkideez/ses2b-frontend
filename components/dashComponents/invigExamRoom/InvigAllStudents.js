import React, { useEffect, useState } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import InvigContainer from './InvigContainer'
import axios from 'axios';
import AnnounceBtn from './AnnounceBtn';
import Fab from '@material-ui/core/Fab';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

const profilePic = [
  "https://pbs.twimg.com/profile_images/1184543288801529862/Lw46ZMHU.jpg",
  "https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg",
  "https://hips.hearstapps.com/digitalspyuk.cdnds.net/18/31/1533133488-scary-movie-2000-ghost-faced-killer-wassup.jpg?resize=480:*",
  "https://static.tvtropes.org/pmwiki/pub/images/b2a4ee66_8d4a_4345_bf45_c4f08e9eedd2.jpeg"
]


export default function InvigAllStudents(props) {
  const [isMute, setMute] = useState(false);
  const [students, setStudents] = useState([])
  // const [strikes, setStrikes] = useState()
  const [exam, setExam] = useState()
  const [isStarted, setIsStarted] = useState(false)
  // let students = [];

  // Getting firebase
  const firestore = getFirestore();

  useEffect(() => {
    getStudents()
  }, [])

  // const getStudents = async () => {
  //   await axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `https://protoruts-backend.herokuapp.com/student/get-exam/${props.examID}`,
  //   }).then((res) => {
  //     console.log(res.data)
  //     setExam(res.data.exam)
  //     setStudents(res.data.students);
  //   })
  // }

  async function getStudents() {
    onSnapshot(doc(firestore, "exams", props.examID), (doc) => {
      let something = []
      setExam(doc.data())
      for (let i = 0; i < doc.data().students.length; i++) {
        something.push([doc.data().students[i], doc.data().strikes[doc.data().students[i]]])
      }
      setStudents(something)
    });
  }

  //enable the exam
  const startExam = async () => {
    await updateDoc(doc(firestore, "exams", props.examID), {
      is_started: true
    })
    setIsStarted(true)
  }
  //finish the exam
  const stopExam = async () => {
    await updateDoc(doc(firestore, "exams", props.examID), {
      is_started: false
    })
    console.log(isStarted)
    setIsStarted(false)
  }

  // Button for toggling mute
  // Map function for every student who is in the exam room
  return (
    <div>
      <AnnounceBtn examID={props.examID} />
      {isStarted ?
        <Fab color="primary" onClick={() => stopExam()}
          style={{
            margin: 0,
            top: 'auto',
            right: 30,
            bottom: 90,
            left: 'auto',
            position: 'fixed',
          }}><StopIcon /></Fab>
        :
        <Fab color="primary" onClick={() => startExam()}
          style={{
            margin: 0,
            top: 'auto',
            right: 30,
            bottom: 90,
            left: 'auto',
            position: 'fixed',
          }}
        ><PlayArrowIcon/></Fab>
      }
      <Fab color="primary" onClick={() => setMute(!isMute)}
        style={{
          margin: 0,
          top: 'auto',
          right: 30,
          bottom: 160,
          left: 'auto',
          position: 'fixed',
        }}
      ><VolumeUpIcon /></Fab>
      <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
        {students.length > 0 ?
          students.map((student, index) =>
            <div key={index}>
              <InvigContainer
                examID={props.examID}
                studentId={student[0]}
                image={profilePic[1]}
                subject={'MAT100'}
                warnings={student[1]}
                isMute={isMute}
                token={props.token}
              />
              <div style={{ padding: 10 }} />
            </div >)
          : null}
      </div>
    </div>
  )
}


