import React, {useState} from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import VideoContainer from '../../../components/dashComponents/studentExamRoom/VideoContainer'
import ScreenShareTest from '../../../components/WebRTC/ScreenShareTest'
import Script from 'next/script'

export default function WebRTC() {
  const [screenStream, setStream] = useState();


  return (
    <Sidebar>
      <div>
        {/* Note from Evan: load tensorflow for video processing. */}
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0"></Script>
        <div>
          <VideoContainer studentId='123454' screenStream={screenStream}/>
        </div>
        <ScreenShareTest setStream={setStream} />
        
      </div>
    </Sidebar>
  )
}