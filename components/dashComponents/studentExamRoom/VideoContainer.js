import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const StudentRTC = dynamic(() => import('./StudentRTC'), { ssr: false });


export default function VideoContainer(props) {
  const studentId = props.studentId;
  // const subject = 'MATH1001';
  

  // const [status, setStatus] = useState(false);
  // Get students webccam stream to pass into StudentRTC
  
  // useEffect(() => {
  //   getVideo();
  // }, [])

  return (
    <div>
      <StudentRTC
        // localStream={stream}
        studentId={studentId}
        // subject={subject}
        screenStream={props.screenStream}
        setConnectionStatus={props.setConnectionStatus}
        token={props.token}
        // style={{display: 'inline'}}
      />
    </div>
  )
}
