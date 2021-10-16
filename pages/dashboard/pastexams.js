import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import WarningIcon from '@material-ui/icons/Warning';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	text:{
		color: theme.palette.text.title, 	
	}
}));

export default function Examroom({ token }) {
	const classes = useStyles();
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
				<Typography className={classes.text} variant="h5">
					Welcome to the past exam room
				</Typography>
			</Sidebar>
		</div>
	)
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
