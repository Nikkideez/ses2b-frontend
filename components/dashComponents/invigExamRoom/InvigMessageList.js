import React, { useState, useEffect} from 'react';
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot, setDoc,
  deleteField, query
} from "firebase/firestore";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemAvatar } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import ChatContainer from './../studentExamRoom/Chat/ChatContainer'
import jwt_decode from 'jwt-decode';

export default function AlignItemsList(props) {
  const [chat, setChat] = useState([]);
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

  const handleSend = () => {
    setMessage("");
    addMessage();
  };

  return (
    <div>

      <List style={{ width: 350, bgcolor: 'background.paper', padding: 0 }}>
        {chat.length > 0 ?
            chat.map((ping, index) =>
              <div key={index}>
                <ChatContainer ping={ping} />
              </div>
            )
          : null}
              {/* <div>
              <ListItem alignItems="flex-start" style={{ padding: 0 }}>
              <ListItemAvatar>
                <Avatar alt="McLOVIN" src={props.image} />
              </ListItemAvatar>
              <ListItemText
                primary={ping.message}
                secondary="11:40"
              />
            </ListItem>
              <Divider variant="inset" component="li" />
              </div> */}
        

      </List>
      <List>
        <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <ListItemAvatar>
            <Avatar alt="McLOVIN">INVIG</Avatar>
          </ListItemAvatar>
          <TextField
            autoFocus
            multiline
            margin="dense"
            fullWidth
            value={ message }
            onChange={e => setMessage(e.target.value)}
          />
          <Button onClick={ handleSend }>
            Send
          </Button>
        </ListItem>
      </List>
    </div>
  );
}