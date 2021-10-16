import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import Link from 'next/link'
import Image from 'next/image'
import profileCard from '/public/profilecardblank.svg'
import subjectList from '/public/subjectlist.svg'
import styles from '../../components/Profile.module.css'
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";

export default function Exams({ token }) {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
    const router = useRouter();

    useEffect(async () => {
        if(!token){
            console.log("it works")
            router.push("/")
    
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
                <div className = {styles.box}>
                 <div className={styles.container}>
                   <Image src={profileCard} alt="user profile card" style="width:100%;"/>
                   <div className={styles.centered}>12345678</div>
                   <div className={styles.centeredfirstName}>John</div>
                   <div className={styles.centeredlastName}>Smith</div>
                 </div>
                 <div className = {styles.subjectbox}>
                  <Image src={subjectList} alt="user subject list" style="width:100%;"/>
                 </div>
                </div>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
