import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import FaceApiTest from '../../components/FaceAPI/FaceApiTest'
import SidebarV2 from '../../components/dashComponents/SidebarV2'

export default function TestFaceAuth({ token }) {
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
                <FaceApiTest/>
            </SidebarV2>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
