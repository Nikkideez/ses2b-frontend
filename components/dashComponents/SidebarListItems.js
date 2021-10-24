import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUserState, isStudentState, sidebarOpenState } from '../States.js';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import LinkIcon from '@material-ui/icons/Link';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import PersonIcon from '@material-ui/icons/Person';
import MessageIcon from '@material-ui/icons/Message';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { MenuItem, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Image from 'next/dist/client/image';
import tempAvatar from '../../src/Images/Moyaicon.png';
import clsx from 'clsx';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';


const stuMenuItems = [
    {
        name: "Dashboard",
        text: "Exam Hub",
        link: "/dashboard",
        icon: <DashboardIcon />,
        divider: false,
    },
    {
        name: "TestEquipment",
        text: "Test Your Equipment",
        link: "/dashboard/testEquipment",
        icon: <VideoLabelIcon />,
        divider: false,
    },
    {
        name: "Results",
        text: "Your Results",
        link: "/dashboard/results",
        icon: <BarChartIcon />,
        divider: false,
    },
    {
        name: "PastExams",
        text: "Past Exams",
        link: "/dashboard/past",
        icon: <AssignmentTurnedInIcon />,
        divider: false,

    },
    {
        name: "Messages",
        text: "Messages",
        link: "/dashboard/messages",
        icon: <MessageIcon />,
        divider: false,
    },
    {
        name: "Help",
        text: "Help",
        link: "/dashboard/help",
        icon: <LayersIcon />,
        divider: false,
    }


]

const invMenuItems = [
    {
        name: "Dashboard",
        text: "Exam Hub",
        link: "/dashboard",
        icon: <DashboardIcon />,
        divider: false,
    },
    {
        name: "All Exams",
        text: "Exam Recordings",
        link: "/dashboard/allexams",
        icon: <VideoLibraryIcon />,
        divider: false,
    },
    {
        name: "Messages",
        text: "Messages",
        link: "/dashboard/messages",
        icon: <MessageIcon />,
        divider: false,
    }

]


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    currentItem: {
        backgroundColor: theme.palette.primary.darker,
        paddingRight: "16px",
        borderLeft: "4px solid #4259d4"

    },
    currentItemIcon: {
        color: theme.palette.secondary.brighter,
        paddingLeft: "8.5px",
        transform: "scale(1)",
    },
    currentItemText: {
        color: theme.palette.secondary.brighter,
    },
    item: {
        '&:hover': {
            backgroundColor: theme.palette.primary.darker,
        }
    },
    itemIcon: {
        paddingLeft: "8.5px",
        transform: "scale(1)",
        color: theme.menuItem.color,
        opacity: theme.menuItem.opacity,
    },
    itemText: {
        color: theme.palette.text.title,
        opacity: 0.8,
    },
    activeItemRect: {
        position: "absolute",
        content: "",
        height: "100%",
        width: "4px",
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
    },
    avatar: {
        margin: 17,
        backagroundColor: "#00000",
        transition: 'height 0.4s, width 0.4s, margin-Left 0.4s',

    },
    bigAvatar: {
        margin: 10,
        width: 150,
        height: 150,
        marginLeft: 40,
        backagroundColor: "#00000",
    },
    avatarHover: {
        opacity: '100%',
        color: '#00000',

        '&:hover': {
            cursor: "pointer",
            display: 'absolute',
            color: '#00000',
            '& $avatarImage': {
                filter: 'Brightness(0.5);',
            },
            '& $avatarLink': {
                visibility: "visible",

            }
        }
    },
    avatarImage: {
    },
    avatarLink: {
        marginLeft: 56,
        marginTop: 55,
        visibility: "hidden",
    },
    titleText:{
        color: theme.palette.text.title,
    }
}));

export default function MainItemsList(props) {
    const classes = useStyles();
    const currentItem = props.currentItem;
    const isOpen = useRecoilValue(sidebarOpenState);
    const currentUser = useRecoilValue(currentUserState);
    const isStudent = useRecoilValue(isStudentState);
    console.log(isStudent);



    if (!isStudent) {
        return (

            <>
                {!isOpen ? <div></div> : <div style={{ marginBottom: "25px" }}>
                    <Typography className={classes.titleText} variant="h6" align="center" style={{ fontSize: "1rem", marginTop: 25 }}>Invigilator Panel</Typography>
                    {currentUser ? <Typography variant="subtitle1" align="center" gutterBottom style={{ color: "#969696", size: '0%' }}>  {currentUser.first_name + " " + currentUser.last + '\n' + '\n'} </Typography> : null}</div>
                }
                {invMenuItems.map((menuItem) => {
                    const isActive = currentItem === menuItem.link;
                    return (
                        <React.Fragment key={menuItem.link}>
                            <Link href={menuItem.link}>
                                {!isOpen ?
                                    <Tooltip title={menuItem.name} placement="right">
                                        <ListItem button className={isActive ? classes.currentItem : classes.item}>
                                            <ListItemIcon className={isActive ? classes.currentItemIcon : classes.itemIcon}>{menuItem.icon}</ListItemIcon>
                                            <ListItemText primary={menuItem.text} className={isActive ? classes.currentItemText : classes.itemText}></ListItemText>
                                        </ListItem>
                                    </Tooltip> :
                                    <ListItem button className={isActive ? classes.currentItem : ""}>
                                        <ListItemIcon className={isActive ? classes.currentItemIcon : classes.itemIcon}>{menuItem.icon}</ListItemIcon>
                                        <ListItemText primary={menuItem.text} className={isActive ? classes.currentItemText : classes.itemText}></ListItemText>
                                    </ListItem>
                                }

                            </Link>
                        </React.Fragment>
                    );

                })

                }
            </>
        )
    }
    else {
        return (
            <>
                <Link href="../dashboard/profile">
                    <Avatar className={`${classes.avatar}${isOpen ? ` ${classes.bigAvatar}` : ``}`} >
                        <Tooltip title="View profile" placement="right">
                            <div className={classes.avatarHover}>
                                <LinkIcon style={{ position: "absolute", zIndex: "10", height: "25%", width: "25%", pointerEvents: "none" }} className={classes.avatarLink} />
                                <Image className={classes.avatarImage} src={tempAvatar}></Image>
                            </div>
                        </Tooltip>
                    </Avatar>
                </Link>
                {!isOpen ? <div></div> : <div style={{ marginBottom: "25px" }}>
                    <Typography variant="h6" align="center" style={{ fontSize: "1rem" }}>Your Dashboard</Typography>
                    {currentUser ? <Typography variant="subtitle1" align="center" gutterBottom style={{ color: "#969696", size: '0%' }}>  {currentUser.first_name + " " + currentUser.last + '\n' + '\n'} </Typography> : null}</div>
                }
                {stuMenuItems.map((menuItem) => {
                    const isActive = currentItem === menuItem.link;
                    return (

                        <React.Fragment key={menuItem.link}>
                            <Link href={menuItem.link}>
                                {!isOpen ?
                                    <Tooltip title={menuItem.name} placement="right">
                                        <ListItem button className={isActive ? classes.currentItem : ""}>
                                            <ListItemIcon className={isActive ? classes.currentItemIcon : classes.itemIcon}>{menuItem.icon}</ListItemIcon>
                                            <ListItemText primary={menuItem.text} style={isActive ? { color: "#4259d4" } : {}}></ListItemText>
                                        </ListItem>
                                    </Tooltip> :
                                    <ListItem button className={isActive ? classes.currentItem : ""}>
                                        <ListItemIcon className={isActive ? classes.currentItemIcon : classes.itemIcon}>{menuItem.icon}</ListItemIcon>
                                        <ListItemText primary={menuItem.text} style={isActive ? { color: "#4259d4" } : {}}></ListItemText>
                                    </ListItem>
                                }

                            </Link>
                        </React.Fragment>
                    );

                })

                }

            </>
        )
    }

}

