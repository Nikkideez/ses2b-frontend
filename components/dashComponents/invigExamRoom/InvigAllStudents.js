import React, { useEffect, useState } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import InvigContainer from './InvigContainer'
import axios from 'axios';
import AnnounceBtn from './AnnounceBtn';

// const array = [
//   { studentId: '123454', name: 'McLOVIN', image: "https://pbs.twimg.com/profile_images/1184543288801529862/Lw46ZMHU.jpg" },
//   { studentId: '121212', name: 'Morpheus', image: "https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg" },
//   { studentId: '303030', name: 'Scream Guy', image: "https://hips.hearstapps.com/digitalspyuk.cdnds.net/18/31/1533133488-scary-movie-2000-ghost-faced-killer-wassup.jpg?resize=480:*" },
//   { studentId: '404040', name: 'Squidward', image: "https://static.tvtropes.org/pmwiki/pub/images/b2a4ee66_8d4a_4345_bf45_c4f08e9eedd2.jpeg" },
// ]
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

  // [[studentID, Warn], [studentID, Warn] ]

  // Button for toggling mute
  // Map function for every student who is in the exam room
  return (
    <div>
      <AnnounceBtn examID={ props.examID }/>
      <button onClick={() => console.log(students)}>Mute Toggle</button>
      <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
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
                />
              {/* <InvigContainer
                  studentId={student.student_id}
                  image={profilePic[1]}
                  name={student.first_name + " " + student.last}
                  // rtc={new RTCPeerConnection(servers)}
                  subject={'MAT100'}
                  // localAudio={localAudio}
                  isMute={isMute}
                  examID={props.examID}
                  warnings={exam.strikes[student.student_id]}
                /> */}
              <div style={{ padding: 10 }} />
            </div >)
          : null}
      </div>
    </div>
  )
}


