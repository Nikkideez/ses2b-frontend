import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ExamsTable from '../../components/dashComponents/upcomingExams/ExamsTable';
import ExamsCurrent from '../../components/dashComponents/upcomingExams/ExamsCurrent';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'

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
    text:{
        color: theme.palette.text.lighter,
    }
}))

export default function Test({ token }) {
    const classes = useStyles();
    const [showCurrent, setCurrent] = React.useState(false);
    // const isStudent = useRecoilValue(isStudentState);
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
    const [isStudent, setStudent] = useRecoilState(isStudentState); 

    useEffect(async () => {
        if (!currentUser) {
            const user = await getUser(token)
            setCurrentUser(user);
            setStudent(user.user_role === 2);
        }
      }, []);
    const handleAgree = () => {
        setCurrent(true);
        console.log("Index side working");
    }
    // Conditionally rendering current exams to only appear if a student has exams
    return (
        <div>
            <SidebarV2>
                
                {showCurrent === true ?
                    <div style={{ paddingBottom: 60 }}>
                        <Typography className={classes.titleText} variant="h5" style={{ paddingBottom: 20 }}>
                            Current Exams
                        </Typography>
                        <ExamsCurrent/>
                    </div>
                    :
                    <div>
                    { isStudent? 
                        <Typography color="secondary" variant="body1" style={{ paddingBottom: 20 }}>
                        You have no current exams.
                        </Typography> : 
                        <Typography className={classes.text} color="secondary" variant="body1" style={{ paddingBottom: 20 }}>
                        No exam to invigilate.
                        </Typography> 
                    }
                    </div>
                }
                <Typography className ={classes.titleText} variant="h5" style={{ paddingBottom: 20 }}>
                    Upcoming Exams
                </Typography>
                <ExamsTable handleAgree={handleAgree} test1="test" />
            </SidebarV2>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}