import React from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {theme, themeTwo} from '../src/theme';
import { isStudentState } from '../components/States';

export default function ThemeWrapper(props){

    const isStudent = useRecoilValue(isStudentState);
    const currTheme = isStudent ? theme : themeTwo; 
    console.log("curr theme " + isStudent );
    return (
        <ThemeProvider theme={currTheme}>
            {props.children}
        </ThemeProvider>
    )

}