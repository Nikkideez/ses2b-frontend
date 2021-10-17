import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import TestStyles from './TestStyles.module.css'
import Logo from '../src/Images/Logo.png'
import Image from 'next/image'

const useStyles = makeStyles((theme) => ({

  menuButton: {
    marginRight: theme.spacing(1),
  },
  logo: {
    color: 'white',
    width: 200, /* you can use % */
    height: 'auto',
    marginleft: 'auto',
    marginright: 'auto',
    marginTop: '20px',
    marginleft: '20px',
    marginbottom: '10px',
  },
  // title: {
  //   flexGrow: 1,
  // },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [hasUser, setHasUser] = React.useState(false);
  useEffect(() => {
    setHasUser(localStorage.getItem('currUser') !== null && 
    JSON.parse(localStorage.getItem('currUser')) !== "")
    });


  return (
    <div >
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={TestStyles.navLink} style={{ flexGrow: 1}}>
            <Link href="/" >
              <div className={classes.logo}>
                  <Image  src={Logo} alt="ProctorUTS Logo" />
              </div>
            </Link>
          </Typography>
          <Link href="https://www.uts.edu.au/current-students/managing-your-course/classes-and-assessment/exams/online-exams" >
            <Button color="inherit" >About</Button>
          </Link>
          <Link href="/contact" >
            <Button color="inherit" >Contact</Button>
          </Link>    
          {hasUser ? <div></div> : <Link href="/login" >
            <Button color="inherit" >Login</Button>
          </Link>}     
        </Toolbar>
      </AppBar>
    </div>
  );
}