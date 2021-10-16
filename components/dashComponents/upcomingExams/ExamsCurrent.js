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
import Link from 'next/link';
import { isStudentState } from '../../States';
import { useRecoilValue } from 'recoil';


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
    color: theme.palette.primary.lighter,
  }
}));

function createData(exam, subject, date, time, available) {
  return {
    exam, subject, date, time, available
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const isStudent = useRecoilValue(isStudentState);

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} className={classes.iconButton}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography >
            {row.exam}
          </Typography>
          <Typography variant='body2'>
            {row.subject}
          </Typography>
        </TableCell>
        <TableCell align="right" >{row.date}</TableCell>
        <TableCell align="right">{row.time}</TableCell>
        <TableCell align="right" style={{width: 330}} size="small">
          <div>
          {
            isStudent?
            <Link href="/dashboard/testFaceAuth">
            <Button style={{color: "#4caf50"}} variant="outlined">
              Enter Exam Room
            </Button>
          </Link> :
           <Link href="/dashboard/examroom/invigMain">
           <Button style={{color: "#4caf50"}} variant="outlined">
             Enter Exam Room
           </Button>
         </Link>
          }
          </div>
          
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
  createData('Final Exam', 'MATH101', '12/12/12', '4:20', false),
];

export default function CollapsibleTable() {
  const classes = useRowStyles();

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="collapsible table">
        <TableHead className ={classes.tableHead}>
          <TableRow>
            <TableCell />
            <TableCell className={classes.tableHeadText} >EXAM</TableCell>
            <TableCell className={classes.tableHeadText}  align="right">DATE</TableCell>
            <TableCell className={classes.tableHeadText}  align="right">TIME</TableCell>
            <TableCell className={classes.tableHeadText} align="right">ACCESS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.subject} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}