import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

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
import ExamAlert from './ExamsAlert'


const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  iconButton: {
    padding: 0,
  },
  tableHeadText:{
    color: theme.palette.text.title,
  },
  tableHead:{
    backgroundColor: theme.palette.primary.main,
  },
  tableRow: {
    backgroundColor: theme.palette.primary.lighterV2,
  },
  rowText:{
    color: theme.palette.text.title,
  },
  tableCellClosed: {
    paddingBottom: 0,
    paddingTop: 0,
    transition: "padding-Top 0.4s, padding-Bottom 0.4s"
  },
  tableCellOpened: {
    paddingTop:10,
    paddingBottom:10,
  }

}));

function createData(exam, subject, date, time, available, status) {
  return {
    exam, subject, date, time, available, status
  };
}



function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const handleAgree = () => {
    console.log("exam side working");
    props.handleAgree();
  }

 

  return (
    <React.Fragment>
      <TableRow className={classes.tableRow}>
        <TableCell >
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} className={classes.iconButton}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className={classes.tableRow}> 
          <Typography className={classes.rowText}>
            {row.exam}
          </Typography>
          <Typography variant='body2' className={classes.rowText}>
            {row.subject}
          </Typography>

        </TableCell>
        <TableCell align="right" className={classes.rowText}>{row.date} </TableCell>
        <TableCell align="right"className={classes.rowText}>{row.time}</TableCell>
        <TableCell align="right">
          <ExamAlert isDisabled={row.available} handleAgree = {handleAgree}/>
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell className={open? classes.tableCellOpened : classes.tableCellClosed} colSpan={6} >
          <Collapse in={open} timeout="auto" >
            <Typography variant="h6" gutterBottom component="div">
              Details
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


const rows = [
  createData('Final Exam', 'MATH101', '12/12/12', '4:20', false, false),
  createData('Final Exam', 'SCIE101', '12/12/12', '4:20', true, false),
  createData('Final Exam', 'ENG101', '12/12/12', '4:20', true, false),
];

export default function CollapsibleTable(props) {
  const handleAgree = () => {
    props.handleAgree();
    rows[0].status = true; 
  }
  const classes = useRowStyles();

  return (
    <TableContainer component={Paper} elevation={0} >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow className={classes.tableHead}>
            <TableCell />
            <TableCell className={classes.tableHeadText}>EXAM</TableCell>
            <TableCell className={classes.tableHeadText} align="right">DATE</TableCell>
            <TableCell  className={classes.tableHeadText} align="right">TIME</TableCell>
            <TableCell className={classes.tableHeadText} align="right" style={{width: 330}}>ACCESS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {(rows.filter(row => row.status === false)).map((row) => (
            <Row  key={row.subject} row={row} handleAgree = {handleAgree}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}