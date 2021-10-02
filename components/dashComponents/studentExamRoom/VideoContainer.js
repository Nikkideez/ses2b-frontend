import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const StudentRTC = dynamic(() => import('./StudentRTC'), { ssr: false });


export default function VideoContainer() {
  const [stream, setStream] = useState();
  const [status, setStatus] = useState(false);
  const getVideo = async () => {
    try {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(localStream);
    }
    catch (err){
      console.log(err)
    }
  }
  useEffect(() => {
    getVideo();
  }, [])

  return (
    <div>
      <StudentRTC
        localStream={stream}
      />
    </div>
  )
}
