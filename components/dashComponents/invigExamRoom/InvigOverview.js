import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  root: {
    paddingRight: 40,
    display: 'flex',
    flexDirection: 'column'
  },
  picture: {
    width: 150,
    height: 150,
    backgroundColor: 'grey',
  },
  tools: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    width: 150,
    paddingRight: 25,
  },
  info: {
    display: 'flex',
    // flexDirection: 'column',
    paddingTop: 20,
    paddingBottom: 10,
  },
  icons: {
    display: 'inline-block',
    // paddingBottom: 20,
    paddingRight: 27,
  }
});

export default function InvigTools(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <img src={props.image}
        className={classes.picture} />
      <div>
        <p>Name: {props.name}</p>
        <p>SID: {props.studentId}</p>
      </div>
      <div className={classes.info}>
        <div className={classes.icons}>
          <IconButton>
            <Badge badgeContent={2} color="secondary">
              <WarningIcon />
            </Badge>
          </IconButton>
        </div>
        <div className={classes.icons}>
          <IconButton>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  )
}
