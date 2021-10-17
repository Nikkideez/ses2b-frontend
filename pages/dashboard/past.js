import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import { Typography } from '@material-ui/core'
import { useRouter } from "next/router";
import Image from 'next/image'
import pastExamsCard from '/public/pastexams.svg'
import styles from '../../components/Profile.module.css'

export default function Past({ token }) {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
    const [isStudent, setStudent] = useRecoilState(isStudentState);
    const router = useRouter();
    useEffect(async () => {
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
                <div className = {styles.resultsBox}>
                 <div className={styles.pastExamsContainer}>
                   <Image src={pastExamsCard} alt="past exams"/>
                 </div>
                </div>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}