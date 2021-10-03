import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { sidebarOpenState, currentUserState, stuState, isStudentState } from '../States.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import Logo from '../../src/Images/Logo.png';
import WhiteLogo from '../../src/Images/Logo white.png';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { ArrowLeft } from '@material-ui/icons';
import { useRouter } from 'next/router';
import tempAvatar from '../../src/Images/Moyaicon.png';
import axios from 'axios';
import { red } from '@material-ui/core/colors';

import MainItemsList from './SidebarListItems.js';





const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#0000',
    color: '#000'
  },
  toolbar: {
    boxShadow: "0px 1px 4px 1px rgba(0,0,0,0.25)",
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 9,
  },
  menuButtonHidden: {
    display: 'none',
  },
  logo: {
    //flexGrow: 1,
  },
  title: {
    //flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0px 1px 4px 1px rgba(0,0,0,0.05)",
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',

    width: theme.spacing(9),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
    color : theme.palette.primary.main,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  button: {
    color: "#4259d4",
  },
  buttonT2:{
    color: "#ffffff",
    marginLeft: 20,
    backgroundColor: "#4259d4",
  },
  toolbarButtonContainer: {
    marginLeft: 'auto'
  },
  toolBarSecondaryItems:{
    marginBottom: 'auto'
  },
  drawerItems: {
    paddingTop: theme.spacing(2),
  }
}));


// Above was all the styling for the components
// The bottom section will contain all the code and logic needed
// to make the sidebar function properly
export default function Dashboard(props) {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [isStudent, setIsStudent] = useRecoilState(isStudentState);

  //this function resets isStudentState to true (for theme purposes)
  // and currentUser to null. 
  const clearUser = () => {
    setCurrentUser(null);
    setIsStudent(true); 
  }

  const classes = useStyles(); 
  const router = useRouter(); 
  const [open, setOpen] = useRecoilState(sidebarOpenState);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    }).then((res) => {
        router.push("/")
    }).catch((error) => {
      console.log("System Error")
    })
    clearUser();
  };
  
  const page = "Dashboard";
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar elevation={0} position="absolute" className={classes.appBar} >
        <Toolbar className={classes.toolbar}>
          <div className={classes.menuButton}><IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton></div>
          <div className={styles.title} style={{cursor:'pointer'}} >
              <Image src={Logo} alt="ProctorUTS Logo" width="146" height="48" onClick={()=>(router.push('/dashboard'))} />
          </div>

          <div className={classes.toolbarButtonContainer}>
            <IconButton color="inherit" >
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

              <Button className={isStudent? classes.button: classes.buttonT2} onClick={handleLogout}>
                Logout
              </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}}
        open={open}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* I'm pulling the actual icons with there respective links from the SidebarListItems file */}
        <List className={classes.drawerItems}>
          <div>
            <MainItemsList currentItem={router.pathname} open={open}/>
          </div>
          <Divider />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {/* the props.children component allows content to be passed into the main section */}
        {/* this is the part where the actual content goes */}
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
        </Container>
      </main>
    </div>
  );
}