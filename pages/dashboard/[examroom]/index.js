import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
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
import Chat from "../../../components/dashComponents/studentExamRoom/Chat/Chat"
import Script from 'next/dist/client/script';


export default function Examroom({ token, firebaseConfig }) {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
	const router = useRouter();
	let examID = useRouter().query.examroom

	useEffect(async () => {
		// Initialize Firebase
		try {
			initializeApp(firebaseConfig);
		} catch {
			console.log("nevermind nothing")
		}
		if (!token) {
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
				{/* Note from Evan: load tensorflow for video processing. */}
				<Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0"></Script>
				{currentUser ?
					<div>
						<Chat token={token} studentId={currentUser.student_id} examID={examID} />
						<MainContainer token={token} studentId={currentUser.student_id} />
					</div>
					: <div>
						Loading.....
					</div>}
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

	return { props: { token: req.cookies.token || "", firebaseConfig: firebaseConfig } };
}