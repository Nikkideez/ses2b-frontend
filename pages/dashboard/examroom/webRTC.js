import React, {useState} from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import VideoContainer from '../../../components/dashComponents/studentExamRoom/VideoContainer'
import ScreenShareTest from '../../../components/WebRTC/ScreenShareTest'


export default function WebRTC() {
  const [screenStream, setStream] = useState();


  return (
    <Sidebar>
      <div>
        <div>
          <VideoContainer screenStream={screenStream}/>
        </div>
        <ScreenShareTest setStream={setStream}/>
      </div>
    </Sidebar>
  )
}
