// import React, { useEffect, useState } from 'react'
// import { useRecoilState, useRecoilValue } from 'recoil';
// import Sidebar from '../../../components/dashComponents/Sidebar'
// import Typography from '@material-ui/core/Typography'
// import Paper from '@material-ui/core/Paper'
// import WarningIcon from '@material-ui/icons/Warning';
// import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
// import Badge from '@material-ui/core/Badge';
// import IconButton from '@material-ui/core/IconButton';
// import { currentUserState, isStudentState } from '../../../components/States';
// import { getUser } from '../../../components/scripts/getUser'
// import MainContainer from '../../../components/dashComponents/studentExamRoom/MainContainer';


// export default function Examroom({token}) {
//     const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
// 	const [isStudent, setStudent] = useRecoilState(isStudentState);
	
// 	useEffect(async () => {
//         if (!currentUser) {
//             const user = await getUser(token)
//             setCurrentUser(user);
//             setStudent(user.user_role === 2);
//         }
// 	}, []);
	
// 	return (
// 		<div>
// 			<Sidebar>
// 				<MainContainer/>
// 				{/* <Typography variant="h5">
// 					Welcome to the exam room
// 				</Typography>
// 				<div style={{ display: 'flex', justifyContent: 'space-around', padding: 60, paddingBottom: 20 }}>
// 					<IconButton>
// 						<Badge badgeContent={1} color="secondary">
// 							<NotificationImportantIcon color="action" fontSize="large" />
// 						</Badge>
// 					</IconButton>
// 					<IconButton>
// 						<Badge badgeContent={3} color="secondary">
// 							<WarningIcon fontSize="large" style={{ color: '#ff9800' }} />
// 						</Badge>
// 					</IconButton>
// 				</div>
// 				<Typography variant="h1" align="center" style={{ padding: 50 }}>
// 					120:00
// 				</Typography>
// 				<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
// 					<Paper style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="outlined" square>
// 						<Typography>
// 							This will hold the video API
// 						</Typography>
// 					</Paper>
// 					<Paper style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="outlined" square>
// 						<Typography>
// 							This will hold the screen record API
// 						</Typography>
// 					</Paper>
// 				</div> */}

// 			</Sidebar>
// 		</div>
// 	)
// }

// export function getServerSideProps({ req, res }) {
//   return { props: { token: req.cookies.token || "" } };
// }