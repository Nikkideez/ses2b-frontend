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
    var student_link = <a href={('https://www.uts.edu.au/current-students/managing-your-course/classes-and-assessment/exams')}>Learn More</a>;
    // var student_text = <p>Are you taking an exam through ProctorUTS?</p>
    var admin_link = <a href={('https://www.uts.edu.au/current-students/managing-your-course/classes-and-assessment/exams')}>Contact ProctorUTS</a>;
    // var admin_text = <p>Are you ProctorUts's point of contact for your institution or department?</p>

    return (
        <div>
            <Sidebar>
                <Typography variant="h5">
                    Help Section
                </Typography>
                <div className="container">
                    <section className="section knowledge-base">
                        <section className="categories blocks">
                            <h1 className="jumbo-message" style={{ textAlign: 'center' }}> Need help? Click on the buttons below to get more information.</h1>
                            <ul className="blocks-list">
                                <li className="blocks-item">
                                    <h2 className="blocks-item-title">Student</h2>
                                    {/* <p className="blocks-item-description">Are you taking an exam through ProctorUTS?</p> */}
                                    {/* <Typography >
                                        Are you taking an exam through ProctorUTS? */}
                                    <div className="blocks-item-link">{student_link}</div>
                                    {/* </Typography> */}
                                </li>

                                <li className="blocks-item">
                                    <h2 className="blocks-item-title">Administrator</h2>
                                    {/* <p className="bloccks-item-description">Are you ProctorUts's point of contact for your institution or department?</p> */}
                                    {/* <Typography>
                                        Are you ProctorUts's point of contact for your institution or department? */}
                                    <div className="blocks-item-link">{admin_link}</div>
                                    {/* </Typography> */}
                                </li>
                            </ul>
                        </section>
                    </section>
                </div>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
