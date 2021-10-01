import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import Sidebar from '../../components/dashComponents/Sidebar'
import { Typography } from '@material-ui/core'
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'

export default function help({ token }) {
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
                    This will display the Help section
                </Typography>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
