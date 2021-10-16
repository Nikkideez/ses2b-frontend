import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import Sidebar from '../../components/dashComponents/Sidebar'
import { Typography } from '@material-ui/core'
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import { useRouter } from "next/router";

export default function Help({ token }) {
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
                <Typography variant="h5">
                    This will display the Help section
                </Typography>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
