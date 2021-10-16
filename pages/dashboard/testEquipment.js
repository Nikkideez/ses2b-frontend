import React, { useRef, useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { currentUserState, isStudentState } from '../../components/States';
import { getUser } from '../../components/scripts/getUser'
import Sidebar from '../../components/dashComponents/Sidebar'
import { Typography } from '@material-ui/core'
import ScreenShare from '../../components/WebRTC/ScreenShare'
import Button from '@material-ui/core/Button'
import Stepper from '../../components/dashComponents/testEquipment/Stepper'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden';
import { Container } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";

const FaceNoSSR = dynamic(() => import('../../components/FaceAPI/FaceStream'), { ssr: false });

//322, 247
export default function TestEquipment({ token }) {
    const [showFace, setFace] = React.useState(false)
    const [videoWidth, setVideoWidth] = React.useState(480)
    const [videoHeight, setVideoHeight] = React.useState(360)
    const [screenWidth, setScreenWidth] = React.useState(504)
    const [screenHeight, setScreenHeight] = React.useState(384)
    const [displayType, setDisplay] = React.useState('flex')
    const [newFlex, setFlex] = React.useState('center')
    const [activeStep, setActiveStep] = React.useState(0)
    // const myref = React.useRef();
    // console.log(myref)
    // const handleCloseVideo = () => myref.current.getClose();
    // const handleStartVideo = () => myref.current.getStart();

    const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isStudent, setStudent] = useRecoilState(isStudentState);
    const router = useRouter();

    useEffect(async () => {
        if(!token){
            console.log("it works")
            router.push("/")
    
        } 
        if (!currentUser) {
            const user = await getUser(token)
            setCurrentUser(user);
            setStudent(user.user_role === 2);
        }
    }, []);

    //Honestly, this is super messy
    //Most of these hooks are just me testing out calling functions between diff components
    //the myref.current callbacks in particular are a method to call functions in child component from parent
    
    return (
        <div>
            <Sidebar>
                <Typography variant="h5">
                    Test Equipment
                </Typography>
                {showFace
                    ?
                    <Stepper
                        setVideoWidth={setVideoWidth}
                        setVideoHeight={setVideoHeight}
                        setScreenWidth={setScreenWidth}
                        setScreenHeight={setScreenHeight}
                        setDisplay={setDisplay}
                        setFlex={setFlex}
                        setActiveStep={setActiveStep}
                        // handleVideoClose={handleCloseVideo}
                        // handleStartVideo={handleStartVideo}
                    >
                        <div style={{ display: 'flex', justifyContent: newFlex, alignItems: 'center', height: 470 }}>
                            <Paper style={{ padding: 5, display: displayType }} variant="outlined" square display="none">
                                <FaceNoSSR
                                    videoWidth={videoWidth}
                                    videoHeight={videoHeight}
                                    // ref={myref} 
                                    />
                            </Paper>
                            {activeStep > 0 && activeStep < 3 ?
                                <Paper variant="outlined" square
                                    style={{ height: screenHeight, width: screenWidth, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ScreenShare />
                                </Paper>
                                : activeStep > 2 &&
                                <div>
                                    <img style={{ maxWidth: 400 }} src={"https://live-production.wcms.abc-cdn.net.au/634f185fc1cb3cb6565d9a84ecb0cae2?impolicy=wcms_crop_resize&cropH=694&cropW=1239&xPos=145&yPos=60&width=862&height=485"} />
                                </div>
                            }
                        </div>
                    </Stepper>
                    : <Button color="secondary" onClick={() => { setFace(true) }}> Begin Calibration</Button>
                }
            </Sidebar>
        </div>
    )
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
