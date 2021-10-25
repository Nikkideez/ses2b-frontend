import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import StepperExam from '../../components/dashComponents/studentExamPrep/stepperExam';
import Sidebar from '../../components/dashComponents/Sidebar'
import Script from 'next/script';
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";

export default function TestFaceAuth({ token, EmailToken, firebaseConfig }) {
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
            <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0"></Script>
            <Script src="https://smtpjs.com/v3/smtp.js"></Script>
            <Sidebar>
                <StepperExam token={token} EmailToken={ EmailToken }/>
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
  return { props: { token: req.cookies.token || "" , EmailToken: process.env.EMAIL_TOKEN, firebaseConfig: firebaseConfig} };
}
