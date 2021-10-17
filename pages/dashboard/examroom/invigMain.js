import React from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import { isStudentState } from '../../../components/States';
// import InvigAllStudents from '../../../components/dashComponents/invigExamRoom/InvigAllStudents';
import dynamic from 'next/dynamic';
import warnLeavePage from '../../../components/dashComponents/warnLeavePage'
import { useRecoilState } from 'recoil';

const InvigAllStudents = dynamic(() => import('../../../components/dashComponents/invigExamRoom/InvigAllStudents'), { ssr: false });

export default function Invig() {
  const message = "Are you sure you want to leave this page while an exam is in progress? \n";
  warnLeavePage(message);
  const [isStudent, setIsStudent] = useRecoilState(isStudentState);  


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
