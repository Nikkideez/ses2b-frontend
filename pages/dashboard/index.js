import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import Sidebar from '../../components/dashComponents/Sidebar'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ExamsTable from '../../components/dashComponents/upcomingExams/ExamsTable';
import ExamsCurrent from '../../components/dashComponents/upcomingExams/ExamsCurrent';
import { currentUserState, hasCurrExamState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import { useRouter } from "next/router";
import InvigExamTable from '../../components/dashComponents/invigDashboard/InvigExamTable';
import InvigToday from '../../components/dashComponents/invigDashboard/InvigToday';
import { initializeApp } from "firebase/app";
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 150,
    },
    fixedHeight: {
        height: 100,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    titleText: {
        color: theme.palette.text.title,
    },
    text: {
        color: theme.palette.text.lighter,
    },
}))

export default function Test({ token, firebaseConfig }) {
    const classes = useStyles();
    const [showCurrent, setCurrent] = React.useState(false);
    const [isStudent, setIsStudent] = useRecoilState(isStudentState);
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
    const hasUser = (currentUser !== null);
    const router = useRouter();
    // get the students exams
    const [exams, setExams] = useState([])
    useEffect(() => {
        getExams()
    }, [])
    const getExams = async () => {
        await axios({
            method: "GET",
            withCredentials: true,
            url: "https://protoruts-backend.herokuapp.com/student/get-exams/8898312",
        }).then((res) => {
            console.log(res.data)
            setExams(res.data);
        })
    }
    if (currentUser)
        console.log(currentUser.accept_terms)
    // route guarding
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
            setCurrentUser(user); // should be able to be deleted but keeping the state here just incase
            setIsStudent(user.user_role === 2);
            localStorage.setItem('currUser', JSON.stringify(user));
        }
        if (localStorage.getItem('hasCurrExam')) {
            console.log(JSON.parse(localStorage.getItem('hasCurrExam')))
            setCurrent(JSON.parse(localStorage.getItem('hasCurrExam')))
        }
    }, []);
    const handleAgree = () => {
        setCurrent(true);
        localStorage.setItem('hasCurrExam', 'true');
        console.log("Index side working");
    }
    // console.log(isStudent)
    // Conditionally rendering current exams to only appear if a student has exams
    // console.log(exams.filter(time => time.date_time.seconds > 10))
    //split the object into two objects
    const upcomingExam = exams.filter(time => time.date_time.seconds <= 1102770720)
    const currentExam = exams.filter(time => time.date_time.seconds > 1102770720)
    if (hasUser) {
        return (
            <div>
                <Sidebar>
                    {isStudent ?
                        <div>
                            {currentExam ?
                                <div style={{ paddingBottom: 60 }}>
                                    <Typography className={classes.titleText} variant="h5" style={{ paddingBottom: 20 }}>
                                        Current Exams
                                    </Typography>
                                    <ExamsTable exams={currentExam} />
                                </div>
                                :
                                <div>
                                    <Typography color="secondary" variant="body1" style={{ paddingBottom: 20 }}>
                                        You have no current exams.
                                    </Typography>
                                </div>
                            }
                            <Typography className={classes.titleText} variant="h5" style={{ paddingBottom: 20 }}>
                                Upcoming Exams
                            </Typography>
                            <ExamsTable exams={upcomingExam} buttonDisabled={true}/>
                        </div>
                        :
                        // <InvigToday />
                        <div>
                            <Typography variant="h5" className={classes.titleText}>
                                Exams
                            </Typography>
                            <InvigExamTable />
                        </div>
                    }
                </Sidebar>
            </div>
        )
    }
    return (
        <div></div>
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