import router from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import ScreenShareTest from '../../components/WebRTC/ScreenShareTest'
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";

export default function TestScreenShare({ token }) {
  const [isScreenShare, setScreenShare] = React.useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
  const router = useRouter();

  useEffect(async () => {
      if(!token){
          console.log("it works")
          router.push("/")
  
      } 
        if (!currentUser) {
            const user = await getUser(token)
            setCurrentUser(user);
            setStudent(user.user_role === 2);
        }
  }, []);
  
  return (
    <div>
      <Sidebar>
        <h1>Turn on your screen share</h1>
        <ScreenShareTest setScreenShare={setScreenShare} />
        {isScreenShare ?
          <div>
            <p>Screen share activated</p>
            <button onClick= {() => router.push("/dashboard/examroom")}>
              Enter Exam Room
            </button>
          </div>
        :
          <p>Turn on your screenshare</p>
        }
      </Sidebar>
    </div>
  )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}

