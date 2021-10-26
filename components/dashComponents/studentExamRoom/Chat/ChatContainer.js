import React, { useState, useEffect, Fragment } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDoc, getFirestore, onSnapshot,
  deleteField, query
} from "firebase/firestore";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { ListItemAvatar } from '@material-ui/core';
import { Avatar } from '@material-ui/core';

export default function ChatContainer(props) {
  const [name, setName] = useState();

  useEffect(() => {
    getMessage()
  }, [])

  async function getMessage() {
    const docSnap = await getDoc(props.ping.user);

    if (docSnap.exists()) {
        setName([docSnap.data().first_name, docSnap.data().last])
    } else {
        // doc.data() will be undefined in this case
        console.log("No such user!");
    }
    }
    
    function getTimeStamp() {
        let newDate = new Date(props.ping.date_time.seconds * 1000)
        let date = checkZero(newDate.getDate());
        let month = checkZero(newDate.getMonth() + 1);
        let year = checkZero(newDate.getFullYear());
        let hours = checkZero(newDate.getHours());
        let minutes = checkZero(newDate.getMinutes());
        let seconds = checkZero(newDate.getSeconds());

        function checkZero(digits) {
        if (digits < 10)
            return `0${digits}`
        return digits
        }

        return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }
    
  return (
    <div>
        {/* Chat box*/}
        {name ?
            <div>
                <ListItem alignItems="flex-start" style={{ padding: 0 }}>
                    <ListItemAvatar>
                        <Avatar alt="McLOVIN">{name[0][0] + name[1][0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={name[0] + " " + name[1]}
                        secondary={
                            <Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                            >
                                {props.ping.message}
                            </Typography>
                                {` - ${getTimeStamp()}`}
                            </Fragment>
                        }
                />
                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        : null }
    </div>
  )
}
