import React, { useEffect, useState} from 'react'
import InvigContainer from './InvigContainer'

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
  { studentId: '123454', name: 'McLOVIN', image: "https://pbs.twimg.com/profile_images/1184543288801529862/Lw46ZMHU.jpg" },
  { studentId: '121212', name: 'Morpheus', image: "https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg" }
]

export default function InvigAllStudents() {
  const [localAudio, setAudio] = useState();
  const [isMute, setMute] = useState(true);
  // const getAudio = async () => {
  //   try {
  //   const localStream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //   });
  //   setAudio(localStream);
  //   }
  //   catch (err){
  //     console.log(err)
  //   }
  // }

  // useEffect(() => {
  //   getAudio();
  // }, [])

  // console.log(localAudio);
  
  return (
    <div>
      <button onClick={() => setMute(!isMute)}>Mute Toggle</button>
      {array.map((student, index) =>
        <div key={index}>
          <InvigContainer
            studentId={student.studentId}
            image={student.image}
            name={student.name}
            // rtc={new RTCPeerConnection(servers)}
            subject={'MATH1001'}
            localAudio={localAudio}
            isMute={isMute}
          />
          <div style={{ padding: 10 }} />
        </div >
      )}
    </div>
  )
}


