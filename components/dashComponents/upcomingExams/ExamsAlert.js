import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUserState, hasCurrExamState, isStudentState } from '../../States';


const useStyles = makeStyles((theme) => ({
  examButton: {
    // backgroundColor: theme.button.buttonBG2,
    color: theme.button.buttonBG4
  },
  examButtonDisabled: {
    backgroundColor: '#f',
  },
  acceptButton: {
    color: theme.button.buttonBG3,
  },

}))


export default function AlertDialog(props) {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  console.log(currentUser.accept_terms)

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    handleClose();
    console.log("alert is firing")
    props.handleAgree(true);

  }

  return (
    <div>
      {!currentUser ?
        <Button variant="outlined"  className={classes.acceptButton} onClick={handleClickOpen} disabled={props.isDisabled}>
          Enter Exam Room
        </Button>
        :
        <Link href={`/dashboard/${props.examId}/studentAuth`} >
          <Button variant="outlined"  disabled={props.isDisabled} className={classes.examButton}>
            Enter Exam Room
          </Button>
        </Link>

      }
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Read Before Taking Exam"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Disagree
          </Button>
          <Button onClick={handleAgree} color="secondary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}