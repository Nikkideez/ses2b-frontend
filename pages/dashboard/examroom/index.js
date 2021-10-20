import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import Sidebar from '../../../components/dashComponents/Sidebar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import WarningIcon from '@material-ui/icons/Warning';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { currentUserState, isStudentState } from '../../../components/States';
import { getUser } from '../../../components/scripts/getUser'
import MainContainer from '../../../components/dashComponents/studentExamRoom/MainContainer';
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";


export default function Examroom({token, firebaseConfig}) {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
	const router = useRouter();
	useEffect(async () => {
		// Initialize Firebase
		try {
			initializeApp(firebaseConfig);
		} catch {
			console.log("nevermind nothing")
		}
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
				{currentUser ?
					<MainContainer token={token} studentId={ currentUser.student_id }/>
				: null}
				{/* <Typography variant="h5">
					Welcome to the exam room
				</Typography>
				<div style={{ display: 'flex', justifyContent: 'space-around', padding: 60, paddingBottom: 20 }}>
					<IconButton>
						<Badge badgeContent={1} color="secondary">
							<NotificationImportantIcon color="action" fontSize="large" />
						</Badge>
					</IconButton>
					<IconButton>
						<Badge badgeContent={3} color="secondary">
							<WarningIcon fontSize="large" style={{ color: '#ff9800' }} />
						</Badge>
					</IconButton>
				</div>
				<Typography variant="h1" align="center" style={{ padding: 50 }}>
					120:00
				</Typography>
				<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<Paper style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="outlined" square>
						<Typography>
							This will hold the video API
						</Typography>
					</Paper>
					<Paper style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="outlined" square>
						<Typography>
							This will hold the screen record API
						</Typography>
					</Paper>
				</div> */}

			</Sidebar>
		</div>
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

  	return { props: { token: req.cookies.token || "" ,  firebaseConfig: firebaseConfig } };
}