import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Sidebar from '../../components/dashComponents/Sidebar'
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'

export default function Exams({ token }) {
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