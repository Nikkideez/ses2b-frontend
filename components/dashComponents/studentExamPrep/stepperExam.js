import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FaceAuth from './FaceAuth';
import ScreenShare from './ScreenShare'
import { useRouter } from "next/router";
import success from '../../../src/Images/success.png';
import Image from 'next/image'
import styles from '../../../styles/StepperExam.module.css'

const steps = ['Face Authentication', 'Test Screen Sharing', 'Start Exam'];

const useStyles = makeStyles((theme) => ({
    icon:{
      color: "default",
    "&$activeIcon": {
      color: "#1976d2"
    },
    "&$completedIcon": {
      color: "#1976d2"
    }
  },
  activeIcon: {},
  completedIcon: {}
}))

export default function HorizontalLinearStepper() {
  const router = useRouter();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [disabledStep2, setDisabledStep2] = useState(true);

  const handleNext = () => {
    if (activeStep == steps.length - 1)
      router.push("/dashboard/examroom")
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
              activeStep === 1 ? <Typography sx={{ mt: 2, mb: 1 }}>Test Screen Sharing</Typography> :
                <Typography sx={{ mt: 2, mb: 1 }}>Exam Preparations Complete</Typography>}
            <div className={styles.display}>
            {activeStep === 0 ? <FaceAuth handleNext={ handleNext }/> :
              activeStep === 1 ? <ScreenShare handleDisabled={handleDisabled} /> :
                <Image src={success} alt="Success" width="300" height="300" style="display:flex; justify-content:center" />}
            </div>
            <div className={styles.display}>
              {activeStep === 2 ? <Typography>Preperations are complete. Please proceed to the exam waiting room.</Typography> : null}
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
              <Button onClick={handleNext} disabled={ activeStep === 1 && disabledStep2 === true}>
                {activeStep === steps.length - 1 ? 'Finish' :
                    activeStep === 0 ? null : 'Next'}
            </Button>
          </Box>
    </Box>
  );
}
