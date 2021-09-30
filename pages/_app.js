import React from 'react';
import { RecoilRoot } from 'recoil';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {theme} from '../src/theme';
import ThemeWrapper from './ThemeWrapper';

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <RecoilRoot>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeWrapper>
        <CssBaseline />
        <Component {...pageProps}/>
      </ThemeWrapper>
    </RecoilRoot>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};