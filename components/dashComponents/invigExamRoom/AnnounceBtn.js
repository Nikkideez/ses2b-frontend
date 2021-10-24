import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

export default function AnnounceBtn(props) {
  const [open, setOpen] = useState(false);
  const [announceDetail, setAnnounceDetail] = useState();

  function submitAnnouncement() {
    axios({
      method: "POST",
      url: `https://protoruts-backend.herokuapp.com/student/announcement/${props.examID}`,
      data: {
        announcement: announceDetail
      },
      withCredentials: true,
    }).then((res) => {
      return res.data;
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    submitAnnouncement()
    setOpen(false);
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={ handleClickOpen }>
        <AddIcon />
      </Fab>
      {/* Dialog box */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new accouncement to all students, please enter details here.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            margin="dense"
            id="name"
            label="Announcement"
            fullWidth
            onChange={e => setAnnounceDetail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
