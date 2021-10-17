import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import { Typography } from '@material-ui/core'
import { useRouter } from "next/router";
import Image from 'next/image'
import resultsCard from '/public/resultsList.svg'
import styles from '../../components/Profile.module.css'


export default function Results({ token }) {
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
    var link = <a href={('https://onestopadmin.uts.edu.au/eStudent/SM/ResultsDtls10.aspx?r=UTS.EST.WEB02&f=UTS.EST.RSLTDTLS.WEB')}>MyStudentAdmin</a>;

    
    return (
        <div>
            <Sidebar>
                <div className = {styles.resultsBox}>
                 <div className={styles.resultsContainer}>
                   <Image src={resultsCard} alt="user results"/>
                   <div className="mystudentadmin">For more results from past sessions, visit {link}.</div>
                 </div>
                </div>
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
