import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Sidebar from '../../components/dashComponents/Sidebar'
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";

export default function Exams({ token }) {
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
                <Typography variant="h5">
                    This will display any messages from the Examinator
                </Typography>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}