import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../src/Images/Logo.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { isStudentState } from '../components/States';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.adsttc.com/media/images/5d5c/2e2e/284d/d1cd/8300/018f/slideshow/02_N7A9067_UTS_Central_credit_Andy_Roberts_hr.jpg?1566322166)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    color: 'white',
    width: '60%', /* you can use % */
    height: 'auto',
    display: 'block',
    marginleft: 'auto',
    marginright: 'auto',
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const router = useRouter();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const logIn = () => {
    axios({
      method: "POST",
      data: {
        email: loginUsername,
        password: loginPassword
      },
      withCredentials: true,
      url: "https://protoruts-backend.herokuapp.com/auth/login"
    }).then((res) => {
      if (res.data) {
        fetch("/api/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token: res.data})
        }).then((res) => {
          router.push("/dashboard")
        }).catch((error) => {
          setFeedback("System Error")
        })
      }
      else if (!res.data)
        setFeedback("Incorrect Email or Password")
      else
        setFeedback("Network Error")
    })
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <div className={classes.logo}>
            <Image src={Logo} alt="ProctorUTS Logo" />
          </div>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* <form className={classes.form} noValidate> */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e => setLoginUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setLoginPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Typography>{feedback}</Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={ logIn }
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/" variant="body2">
                {"Home"}
              </Link>
            </Grid>
          </Grid>
          {/* <Box mt={5}>
              <Copyright />
            </Box> */}
          {/* <Button
              type="submit"
              fullWidth
              variant="text"
              color="primary"
              className={classes.submit}
              href="/"
            >
              Go Back
            </Button> */}
          {/* </form> */}
        </div>
      </Grid>
    </Grid>
  );
}