import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FaceAuth from './FaceAuth';
import ScreenShare, { stopScreen } from './ScreenShare'
import { useRouter } from "next/router";
import success from '../../../src/Images/success.png';
import Image from 'next/image'
import styles from '../../../styles/StepperExam.module.css'
import VideoFilter, { stopVideo, getPreference } from './VideoFilter'
import { useRecoilState } from 'recoil';
import { currentUserState } from '../../States';
import axios from 'axios';

const steps = ['Face Authentication', 'Video Filter' ,'Test Screen Sharing', 'Start Exam'];

const useStyles = makeStyles((theme) => ({
  image: {
    "display": "flex",
    "justify-content": "center"
  },

  icon:{
    color: "default",
    "&$activeIcon": {
      color: "#2979FF"
    },
    "&$completedIcon": {
      color: "#2979FF"
    }
  },
  activeIcon: {},
  completedIcon: {}
}))

export default function StepperExam(props) {
  const router = useRouter();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [disabledStep2, setDisabledStep2] = useState(true);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [filterPreferences, setFilterPreferences] = useState([]);

  useEffect(() => {
    setFilterPreferences(getFilterPreferences(props.token))
  }, [])

  async function getFilterPreferences(token) {
    await axios({
        method: "POST",
        url: "https://protoruts-backend.herokuapp.com/student/get-filter-preferences",
        data: {
          idToken: token
        },
        withCredentials: true,
    }).then((res) => {
        return res.data;
    })
  }

  async function updateFilterPreferences(token, filter_preference) {
      await axios({
          method: "POST",
          url: "https://protoruts-backend.herokuapp.com/student/update-filter-preferences",
          data: {
            idToken: token,
            filter_preference: filter_preference
          },
          withCredentials: true,
      }).then((res) => {
          return res.data;
      })
  }

  const handleNext = () => {
    if (activeStep == 1) {
      stopVideo();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    else if (activeStep == 2) {
      stopScreen();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    else if (activeStep == steps.length - 1) {
      if (JSON.stringify(filterPreferences) != JSON.stringify(getPreference())) {
        updateFilterPreferences(props.token, getPreference())
      }
      router.push("/dashboard/" + router.query.examroom)
      }
    else
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleDisabled = () => {
    setDisabledStep2(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps} StepIconProps={{ classes:{ root: classes.icon, active: classes.activeIcon, completed: classes.completedIcon } }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            {activeStep === 0 ? <Typography sx={{ mt: 2, mb: 1 }}>Face Authentication</Typography> :
              activeStep ===1 ? <Typography sx={{ mt: 2, mb: 1 }}>Configure Video Filter</Typography> :
                activeStep === 2 ? <Typography sx={{ mt: 2, mb: 1 }}>Test Screen Sharing</Typography> :
                  <Typography sx={{ mt: 2, mb: 1 }}>Exam Preparations Complete</Typography>}
            {currentUser ?
                <div className={styles.display}>
                  {activeStep === 0 ? <FaceAuth handleNext={handleNext} token={props.token} EmailToken={props.EmailToken} name={ currentUser.first_name}/> :
                    activeStep === 1 ? <VideoFilter filter_preference={currentUser.filter_preference}/> :
                          activeStep === 2 ? <ScreenShare handleDisabled={handleDisabled} /> :
                        <Image src={success} alt="Success" width="300" height="300" className={classes.image} />}
                </div>
            : null }
            <div className={styles.display}>
              {activeStep === 3 ? <Typography>Preperations are complete. Please proceed to the exam waiting room.</Typography> : null}
            </div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} disabled={ activeStep === 2 && disabledStep2 === true}>
                {activeStep === steps.length - 1 ? 'Finish' :
                    activeStep === 0 ? null : 'Next'}
            </Button>
      </Box>
    </Box>
  );
}
