import React, { useEffect, useState } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link'
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
// import ExamAlert from './ExamsAlert'


const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  iconButton: {
    padding: 0,
    color: theme.palette.text.title,
  },
  tableBorder: {
    backgroundColor: theme.palette.primary.darker,
  },
  rowBorder: {
    backgroundColor: theme.palette.primary.darker,
    borderColor: theme.palette.primary.darker,
    color: theme.palette.primary.darker,
  },
  tableHeadText: {
    color: theme.palette.text.title,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
  },
  tableRow: {
    backgroundColor: theme.palette.primary.main,
  },
  tableCell: {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.darker,
    color: theme.palette.text.title,
  },
  // rowText: {
  //   color: theme.palette.text.title,
  // },
  tableCellClosed: {
    paddingBottom: 0,
    paddingTop: 0,
    transition: "padding-Top 0.4s, padding-Bottom 0.4s"
  },
  tableCellOpened: {
    paddingTop: 10,
    paddingBottom: 10,
  }

}));

// Represent the data to go in each cell for the row
function Row(props) {
  // the exam object
  const row = props.row;
  console.log(row)
  // drawer for opening and closing the collapse
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  
  const date = new Date(row.date_time.seconds * 1000)
  console.log(date)
  console.log(date.getDate())

  return (
    <React.Fragment >
      <TableRow className={classes.tableRow}>
        <TableCell className={classes.tableCell}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} className={classes.iconButton}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className={classes.tableCell}>
          <Typography className={classes.rowText}>
            {row.exam}
          </Typography>
          <Typography variant='body2' className={classes.rowText}>
            {row.subject}
          </Typography>

        </TableCell>
        <TableCell align="right" className={classes.tableCell}>{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</TableCell>
        <TableCell align="right" className={classes.tableCell}>{`${date.getHours()}:${date.getMinutes()}`}</TableCell>
        <TableCell align="right" className={classes.tableCell}>
          <Link href={`./dashboard/invigRoom/${row.id}`}>
            <Button variant="outlined" color="secondary">
              Enter Exam Room
            </Button>
          </Link>
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell className={open ? classes.tableCellOpened : classes.tableCellClosed} colSpan={6} >
          <Collapse in={open} timeout="auto" className={classes.tableCell}>
            <Typography variant="h6" gutterBottom component="div">
              Details
            </Typography >
            <Typography >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// The whole table
export default function InvigExamTable(props) {
  // Getting the actual data
  const [exams, setExams] = useState([])
  useEffect(() => {
    getExams()
  }, [])
  const getExams = async () => {
    await axios({
      method: "GET",
      withCredentials: true,
      url: "https://protoruts-backend.herokuapp.com/student/invigilator/8025498",
    }).then((res) => {
      console.log(res.data)
      setExams(res.data);
    })
  }

  const classes = useRowStyles();

  return (
    <TableContainer component={Paper} elevation={0} className={classes.tableBorder}>
      <Table aria-label="collapsible table" className={classes.tableHead}>
        <TableHead >
          <TableRow className={classes.tableHead}>
            <TableCell />
            <TableCell className={classes.tableHeadText}>EXAM</TableCell>
            <TableCell className={classes.tableHeadText} align="right">DATE</TableCell>
            <TableCell className={classes.tableHeadText} align="right">TIME</TableCell>
            <TableCell className={classes.tableHeadText} align="right" style={{ width: 330 }}>ACCESS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {exams.map((exam) => (
            <Row key={exam.subject} row={exam}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}