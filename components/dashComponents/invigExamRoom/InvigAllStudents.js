import React, { useEffect, useState } from 'react'
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

// let students = [];


export default function InvigAllStudents() {
  const [isMute, setMute] = useState(false);
  const [students, setStudents] = useState([])
  useEffect(() => {
    getStudents()
  }, [])

  const getStudents = async () => {
    await axios({
      method: "GET",
      withCredentials: true,
      url: "https://protoruts-backend.herokuapp.com/student/exam/MAT100",
    }).then((res) => {
      console.log(res.data)
      setStudents(res.data);
      // students = res.data;
    })
  }

  // Button for toggling mute
  // Map function for every student who is in the exam room
  return (
    <div>
      <AnnounceBtn/>
      <button onClick={() => setMute(!isMute)}>Mute Toggle</button>
      <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
        {students.length ?
          students.map((student, index) =>
            <div key={index}>
              <InvigContainer
                studentId={student.student_id}
                image={profilePic[1]}
                name={student.first_name + " " + student.last}
                // rtc={new RTCPeerConnection(servers)}
                subject={'MAT100'}
                // localAudio={localAudio}
                isMute={isMute}
              />
              <div style={{ padding: 10 }} />
            </div >)
          : null}
      </div>
    </div>
  )
}


