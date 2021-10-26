import React, { useState, useEffect } from 'react'
import {
  collection, addDoc, doc, updateDoc, setDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';
import axios from 'axios';
import ChatContainer from './ChatContainer'
import jwt_decode from 'jwt-decode';

export default function Chat(props) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(["No messages..."]);
  const [message, setMessage] = useState();


  // Getting firebase
  const firestore = getFirestore();

  useEffect(() => {
    getChat()
  }, [])

  async function getChat() {
    onSnapshot(doc(firestore, `students/${props.studentId}/Exam`, props.examID), async (doc) => {
      if (doc.exists()) {
        setChat(doc.data().chat)
      } else {
        addNew();
      }
    })
  }

  function addNew() {
    setDoc(doc(firestore, `students/${props.studentId}/Exam`, props.examID), { chat: [] }, { merge: true });
  }

  function addMessage() {
    let message_update = chat
    message_update.push({
      date_time: new Date(),
      message: message,
      user: doc(firestore, "users", getUserID())
    })

    updateDoc(doc(firestore, `students/${props.studentId}/Exam`, props.examID), {
      chat: message_update
    })
  }

  function getUserID () {
    return jwt_decode(props.token).user_id
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setMessage("");
    addMessage();
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={ handleClickOpen }>
        <ChatIcon />
      </Fab>
      {/* Dialog box */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Chat</DialogTitle>
        <DialogContent>
          <Paper style={{ minHeight: 500, maxHeight: 500, overflow: 'auto' }} elevation={0} spacing={6}>
            <List style={{ width: 350, bgcolor: 'background.paper', padding: 0 }}>
              {chat.map((ping, index) =>
                <div key={index}>
                  <ChatContainer ping={ping} />
                </div>
              )}
            </List>
          </Paper>
          <TextField
            autoFocus
            multiline
            margin="dense"
            label="Message"
            fullWidth
            value={ message }
            onChange={e => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
