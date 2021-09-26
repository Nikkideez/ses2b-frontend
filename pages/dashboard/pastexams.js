import React from 'react'
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import WarningIcon from '@material-ui/icons/Warning';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	text:{
		color: theme.palette.text.title, 	
	}
}));

export default function examroom() {
	const classes = useStyles();
	return (
		<div>
			<SidebarV2>
				<Typography className={classes.text} variant="h5">
					Welcome to the past exam room
				</Typography>
			</SidebarV2>
		</div>
	)
}
