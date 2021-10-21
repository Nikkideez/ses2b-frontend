import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {theme, themeTwo} from '../src/theme';
import { isStudentState } from '../components/States';
import { useRouter } from 'next/router';

export default function ThemeWrapper({children}){
    const [isStudent, setStudent] = useRecoilState(isStudentState);
    const router = useRouter();
    const currTheme = (isStudent || router.pathname === '/' ||router.pathname === '/login') ? theme : themeTwo; 
    // the or operator on the router value ensures that the homepage displays white regardless of user role. 
    console.log(router.pathname)
    useEffect(() => {
        if(localStorage.getItem('currUser') !== null){
            setStudent(JSON.parse(localStorage.getItem('currUser')).user_role === 2); 
        }
      }, []);
    return (
        <ThemeProvider theme={currTheme}>
            {children}
        </ThemeProvider>
    )

}