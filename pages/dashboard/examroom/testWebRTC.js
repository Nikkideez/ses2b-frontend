import React from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import VideoContainer from '../../../components/dashComponents/studentExamRoom/VideoContainer'



export default function webRTC() {
  return (
    <Sidebar>
      <div>
        <div>
          <VideoContainer />
        </div>
      </div>
    </Sidebar>
  )
}
