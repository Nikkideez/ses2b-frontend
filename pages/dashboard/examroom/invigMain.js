import React from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
// import InvigAllStudents from '../../../components/dashComponents/invigExamRoom/InvigAllStudents';
import dynamic from 'next/dynamic';

const InvigAllStudents = dynamic(() => import('../../../components/dashComponents/invigExamRoom/InvigAllStudents'), { ssr: false });

export default function envig() {
  return (
    <Sidebar>
      <div>
        <div>
          <InvigAllStudents />
        </div>
      </div>
    </Sidebar>
  )
}
