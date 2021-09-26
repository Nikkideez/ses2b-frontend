import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'© Copyright UTS - CRICOS Provider No: 00099F '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: '#000000',
     /*  theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[900], */
  },
  footerHeadingText: {
    color: '#ffffff',
    marginBottom: '20px',
  },
  footerParagraphText: {
    color: '#b2b2b2', 
    lineHeight: '0.7',
    fontSize: '85%',
  },
    
  grid: {
      width: '100%',
      flexdirection: 'column',
    },
  copyR: {
    marginTop: '10%',
  },
  divo: {
  },
  tupperware : {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: '100vh',
  },
  copy: {
    color: '#a1a1b2',
    fontSize: '10px',
    marginLeft: '15%',
  },
  social: {
    padding: '0%',
  },

  socialGrid: {
    maxWidth: '40px',
  },

}));


export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <footer className={classes.footer}>
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={3} >
                  <div > 
                      <Typography className={classes.footerHeadingText} variant="body1">About UTS</Typography>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/about/university/overview", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>The University</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://maps.uts.edu.au/map.cfm", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Campus maps</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/about/uts-governance/about-governance-uts", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>UTS governance</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/about/faculties/overview", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Faculties</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/about/utsweb-statements/privacy-statement", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Privacy statement</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/about/utsweb-statements/accessibility-statement", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Accessibility</p> </Link>
                  </div>
                </Grid>

                <Grid item xs={12} md={3}>
                  <div> 
                      <Typography className={classes.footerHeadingText} variant="body1">News</Typography>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/partners-and-community/events", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Events</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/news/find-expert", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Find an expert</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/news/media-contacts", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Media centre</p> </Link>
                  </div>

                </Grid>
                
                <Grid item xs={12} md={3}>
                  <div> 
                      <Typography className={classes.footerHeadingText} variant="body1">Staff</Typography>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/staff-connect", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Staff Connect</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/webmail", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Webmail</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/staff-directory", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Staff Directory</p> </Link>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/current-vacancies", "_blank")}> <p className={classes.footerParagraphText}></p><p className={classes.footerParagraphText}>Jobs at UTS</p> </Link>
                  </div>


                </Grid>
                
                <Grid item xs={12} md={3}>
                  <div > 
                      <Typography className={classes.footerHeadingText} variant="body1">Contact us</Typography>
                      <Link href="#" onClick={()=> window.open("https://www.uts.edu.au/current-students/managing-your-course/ask-uts", "_blank")}> <p className={classes.footerParagraphText}>Student and public enquiries</p> </Link>
                      <Container maxWidth="xs" className={classes.social} >   
                                       
                          <Grid container  >
                            <Grid item xs={12} md={3}  className={classes.socialGrid}>
                              {/* <CheckCircleIcon fontSize="large" style={{ color:green[500]}}></CheckCircleIcon> */}
                              <Link href="#" onClick={()=> window.open("http://facebook.com/UTSEngage", "_blank")}> <FacebookIcon fontSize="small" style={{color: '#b2b2b2'}}></FacebookIcon> </Link>
                            </Grid>

                            <Grid item xs={12} md={3}  className={classes.socialGrid}>
                            <Link href="#" onClick={()=> window.open("https://twitter.com/utsengage", "_blank")}> <TwitterIcon fontSize="small" style={{color: '#b2b2b2'}}></TwitterIcon></Link>
                            </Grid>

                            <Grid item xs={12} md={3}  className={classes.socialGrid}>
                            <Link href="#" onClick={()=> window.open("http://instagram.com/utsengage", "_blank")}> <InstagramIcon fontSize="small" style={{color: '#b2b2b2'}}></InstagramIcon></Link>
                            </Grid>

                            <Grid item xs={12} md={3}  className={classes.socialGrid}>
                            <Link href="#" onClick={()=> window.open("http://linkedin.com/company/166678", "_blank")}> <LinkedInIcon fontSize="small" style={{color: '#b2b2b2'}}></LinkedInIcon></Link>
                            </Grid>
                      
                          </Grid>
                          </Container>  
                  </div>
                </Grid>
                

            </Grid>
            <div className={classes.copy} >
                <p className={classes.copy}> {'© Copyright UTS - CRICOS Provider No: 00099F - '} {new Date().getFullYear()} (SES 2B Group 1 - Spring 2021)</p>
            </div>
        </Container>
      </footer>
    </div>
  );
}