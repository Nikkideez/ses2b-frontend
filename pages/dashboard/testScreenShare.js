import router from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import ScreenShareTest from '../../components/WebRTC/ScreenShareTest'

export default function TestScreenShare({ token }) {
  const [isScreenShare, setScreenShare] = React.useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
	
	useEffect(async () => {
        if (!currentUser) {
            const user = await getUser(token)
            setCurrentUser(user);
            setStudent(user.user_role === 2);
        }
  }, []);
  
  return (
    <div>
      <SidebarV2>
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
      </SidebarV2>
    </div>
  )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}

