import React, { useEffect, useState } from 'react'
import InvigContainer from './InvigContainer'

const array = [
  { studentId: '123454', name: 'McLOVIN', image: "https://pbs.twimg.com/profile_images/1184543288801529862/Lw46ZMHU.jpg" },
  { studentId: '121212', name: 'Morpheus', image: "https://i.kym-cdn.com/entries/icons/facebook/000/009/889/Morpheus2.jpg" },
  { studentId: '303030', name: 'Scream Guy', image: "https://hips.hearstapps.com/digitalspyuk.cdnds.net/18/31/1533133488-scary-movie-2000-ghost-faced-killer-wassup.jpg?resize=480:*" },
  { studentId: '404040', name: 'Squidward', image: "https://static.tvtropes.org/pmwiki/pub/images/b2a4ee66_8d4a_4345_bf45_c4f08e9eedd2.jpeg" },
]

export default function InvigAllStudents() {
  const [isMute, setMute] = useState(false);
  // Button for toggling mute
  // Map function for every student who is in the exam room
  return (
    <div>
      <button onClick={() => setMute(!isMute)}>Mute Toggle</button>
      <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
        {array.map((student, index) =>
          <div key={index}>
            <InvigContainer
              studentId={student.studentId}
              image={student.image}
              name={student.name}
              // rtc={new RTCPeerConnection(servers)}
              subject={'MATH1001'}
              // localAudio={localAudio}
              isMute={isMute}
            />
            <div style={{ padding: 10 }} />
          </div >
        )}
      </div>
    </div>
  )
}


