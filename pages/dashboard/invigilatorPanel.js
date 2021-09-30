import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import WarningIcon from '@material-ui/icons/Warning';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Smartphone } from '@material-ui/icons';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
        marginTop: '20',
	},
	text:{
		color: theme.palette.text.title, 	
	},
    container:{
        backgroundColor : theme.palette.primary.lighter,
        height:'80vh',
        width: '10%',
        marginTop:'600',
        flex:4,
    },
    notificationBar:{
        backgroundColor: theme.palette.primary.main,
        height:'80vh',
        width: '10%',
        float: 'left',
        flex:1,
    }

}));

export default function InvigilatorPanel({ token }) {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
    const [isStudent, setStudent] = useRecoilState(isStudentState);
    
    useEffect(async () => {
        if (!currentUser) {
            const user = await getUser(token)
            setCurrentUser(user);
            setStudent(user.user_role === 2);
        }
	}, []);
	return (
		<div>
			<SidebarV2>
			
                <div>
                <Typography className={classes.text} variant="h5">
					Current Exam
				</Typography>
                <div className={classes.root}>
                <Container className={classes.container}>
                    <Container elevation={1}></Container>

                </Container>
                <Container className={classes.notificationBar}>

                </Container>
                </div>
                </div>
                
			</SidebarV2>
		</div>
	)
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}