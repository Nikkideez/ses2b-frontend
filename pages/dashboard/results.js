import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import { Typography } from '@material-ui/core'


export default function Results({ token }) {
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
                <Typography variant="h5">
                    This will display the Results section
                </Typography>
            </SidebarV2>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
