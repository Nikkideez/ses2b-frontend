import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/dashComponents/Sidebar'
import { currentUserState, isStudentState } from '../../../components/States';
// import InvigAllStudents from '../../../components/dashComponents/invigExamRoom/InvigAllStudents';
import dynamic from 'next/dynamic';
import warnLeavePage from '../../../components/dashComponents/warnLeavePage'
import { useRecoilState } from 'recoil';
import { getUser } from '../../../components/scripts/getUser'
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";

const InvigAllStudents = dynamic(() => import('../../../components/dashComponents/invigExamRoom/InvigAllStudents'), { ssr: false });


export default function InvigMain({ token, firebaseConfig }) {
  console.log(useRouter().query.examId)
  const message = "Are you sure you want to leave this page while an exam is in progress? \n";
  warnLeavePage(message);
  const [isStudent, setIsStudent] = useRecoilState(isStudentState);


  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const router = useRouter();
  useEffect(async () => {
    // Initialize Firebase
    try {
      initializeApp(firebaseConfig);
    } catch {
      console.log("nevermind nothing")
    }
    if (!token) {
      alert("Please log in")
      router.push("/login")
    }
    if (!currentUser) {
      const user = await getUser(token)
      setCurrentUser(user);
      setIsStudent(user.user_role === 2);
    }
  }, []);
  const [isExam, setIsExam] = useState(true)
  return (

    <Sidebar>
      {isExam ?
        < InvigAllStudents />
      :
        <div>
          This exam does not exist
        </div>
      }
    </Sidebar>
  )
}

export function getServerSideProps({ req, res }) {
  const firebaseConfig = {
    apiKey: process.env.PRIVATE_API_KEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
  }

  return { props: { token: req.cookies.token || "", firebaseConfig: firebaseConfig } };
}