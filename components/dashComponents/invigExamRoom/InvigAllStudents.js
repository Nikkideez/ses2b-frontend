import React from 'react'
import ComponentContainer from './ComponentContainer'
import TestComponentContainer from './TestComponentContainer'

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const array = [
  { studentId: '123454', name: 'McLOVIN', rtc: new RTCPeerConnection(servers), image: "https://pbs.twimg.com/profile_images/1184543288801529862/Lw46ZMHU.jpg" },
  { studentId: '121212', name: 'Morpheus', rtc: new RTCPeerConnection(servers), image: "https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg" }
]
// const pc = [
//   new RTCPeerConnection(),
//   new RTCPeerConnection(),
//   new RTCPeerConnection(),
//   new RTCPeerConnection(),
//   new RTCPeerConnection(),
// ]

export default function InvigAllStudents() {

  return (
    <div>
      {array.map((student, index) =>
        <div key={index}>
          <ComponentContainer
            // key={index}
            studentId={student.studentId}
            image={student.image}
            name={student.name}
            rtc={student.rtc}
            subject={'MATH1001'}
          />
          <div style={{ padding: 10 }} />
        </div >
      )}
    </div>
  )
}


