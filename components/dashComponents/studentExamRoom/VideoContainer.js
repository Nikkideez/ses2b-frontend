import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const StudentRTC = dynamic(() => import('./StudentRTC'), { ssr: false });


export default function VideoContainer() {
  const localRef = useRef();
  const [stream, setStream] = useState();
  const getVideo = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(localStream);
    // localRef.current.srcObject = localStream;
    console.log(stream);
    console.log(localRef);
  }
  useEffect(() => {
    getVideo();
  }, [])

  return (
    <div>
      <StudentRTC localRef={localRef} />
    </div>
  )
}
