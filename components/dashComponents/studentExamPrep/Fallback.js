import React, { useRef, useState, useEffect } from "react";
import styles from '../../../styles/Face.module.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useRecoilState } from 'recoil';
import { currentUserState } from '../../States';
import jwt_decode from "jwt-decode";

let randomNumber;

export default function Fallback(props) {
    const [currentUser] = useRecoilState(currentUserState);
    const [random, setRandom] = useState();
    const [input, setInput] = useState();
    const [feedback, setFeedback] = useState();

    useEffect(() => {
        randomNumber = generateNumber();
        setRandom(randomNumber)
        sendEmail(getEmail(props.token), randomNumber)
    }, [])

    function generateNumber() {
        return parseInt(Math.floor(Math.random() * 900000) + 100000);
    }

    const sendEmail = (email, code) => {
        Email.send({
            SecureToken: props.EmailToken,
            To: email,
            From: "proctoruts@gmail.com",
            FromName: "Proctor UTS",
            Subject: "Email Verification",
            Body: "Hi " + props.name +"!<br><br> We noticed you were not able to authenticate using our face authentication process. Please enter this code to finish logging in:<br><br>" + code +"<br><br>If you did NOT initiate this log-in, we highly recommend you changing your password. If you are still unable to login, please contact admin.<br><br>Thanks,<br>ProctorUTS" ,
        });
    }
    
    function getEmail (token) {
        return jwt_decode(token).email
    };

    const submit = () => {
        if (input == random) {
            props.handleUnlock()
        } else {
            setFeedback("Incorrect Code")
        }
    }

    return (
        <div>
            <Typography>An Email has been sent to your inbox with an authorization code. If you have not received an email, check spam folder or contact admin.</Typography>
            <div className={styles.fallback}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    size = 'small'
                    label="Enter 6-digit code"
                    onChange={ e => setInput(e.target.value)}
                    autoFocus
                    />
                <Button style={{ height: 45 }} onClick={submit}>confirm</Button>
            </div>
            <Typography>{ feedback }</Typography>
        </div>
    );
}