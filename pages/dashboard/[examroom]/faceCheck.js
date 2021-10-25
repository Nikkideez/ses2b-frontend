import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../../components/States';
import { getUser } from '../../../components/scripts/getUser'
import FaceApiTest from '../../../components/FaceAPI/FaceApiTest'
import Sidebar from '../../../components/dashComponents/Sidebar'
import { useRouter } from "next/router";

export default function TestFaceAuth({ token }) {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
    const router = useRouter();
    useEffect(async () => {
        if (!token){
            alert("Please log in")
            router.push("/login")
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
                <FaceApiTest/>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
