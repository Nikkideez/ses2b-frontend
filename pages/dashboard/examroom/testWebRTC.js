import React from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import TestVideoContainer from '../../../components/dashComponents/studentExamRoom/TestVideoContainer'



export default function webRTC() {
  return (
    <Sidebar>
      <div>
        <div>
          <TestVideoContainer />
        </div>
      </div>
    </Sidebar>
  )
}
