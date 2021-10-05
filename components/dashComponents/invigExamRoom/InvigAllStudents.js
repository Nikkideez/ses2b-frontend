import React from 'react'
import ComponentContainer from './ComponentContainer'
import TestComponentContainer from './TestComponentContainer'

const array = ['123454', '121212']

export default function InvigAllStudents() {

  return (
    <div>
      {/* {array.map((student, index) => 
      <div key={index}> */}
      <ComponentContainer
        // key={index}
        studentId={'123454'}
        subject={'MATH1001'}
      />
      <div style={{padding: 10}}/>
      {/* </div>
          <ComponentContainer
         key={index}
           studentId={'121212'}
           subject={'MATH1001'}
         /> */}
      <TestComponentContainer
        studentId={'121212'}
        subject={'MATH1001'}
      />
    </div >
  )
}


