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
import { useRouter } from "next/router";
import InvigExamTable from '../../components/dashComponents/invigDashboard/InvigExamTable';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	header: {
		paddingBottom: 20,
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
				<div className={classes.header}>
				<Typography className={classes.text} variant="h5" align="center">
					View all exams
				</Typography>
				</div>
				<InvigExamTable/>
			</Sidebar>
		</div>
	)
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
