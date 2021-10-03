import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../../../components/dashComponents/Sidebar'
import ComponentContainer from '../../../components/dashComponents/invigExamRoom/ComponentContainer';


export default function envig() {
  return (
    <Sidebar>
      <div>
        <div>
          <ComponentContainer />
        </div>
      </div>
    </Sidebar>
  )
}
