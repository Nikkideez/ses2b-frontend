import React, { useState, useRef, useEffect } from 'react'
import {
  collection, addDoc, doc, updateDoc, getDocs, getFirestore, onSnapshot,
  deleteField, query, where
} from "firebase/firestore";
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import { themeTwo } from '../../../src/theme';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles({
  root: {
    padding: 15,
    display: 'flex',
    width: 'min-content',
    backgroundColor: themeTwo.palette.primary.main
  },

});

export default function AnnounceContainer(props) {
  const classes = useStyles(props);

  const firestore = getFirestore();

  useEffect(() => {
    getStudentDetail()
  }, [])

  async function getStudentDetail() {
    const q = query(collection(firestore, 'users'), where('student_id', "==" , parseInt(props.studentId)))
    
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setStudent(doc.data())
    })
  }

  return (
    <div>
        <Paper className={classes.root} variant="outlined" style={{width:"100%", minHeight:200}}>
              <Typography style={{ color: themeTwo.palette.text.title }} variant="h4">Announcements:</Typography>
              <List>
            {props.announcements.map((announcement, index) =>
                <div key={index}>
                    <ListItem>
                        <li style={{ color: themeTwo.palette.text.title }}>•{announcement}</li>
                    </ListItem>
                </div >)}
                </List>
        </Paper>
    </div>
  )
}
