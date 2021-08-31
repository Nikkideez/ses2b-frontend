import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Navbar from '../components/Navbar';
import Link from 'next/link'
import Grid from '@material-ui/core/Grid';
import Logo from '../src/Images/Logo.png'
import Landin from '../src/Images/Landin.png'
import Footer from '../components/Footer';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ProctorUTS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/ProctorUTS2.png" />
      </Head>
      <Navbar></Navbar>
      <div className={styles.header}>
      
        <main className={styles.main}>
           <Grid container className={styles.Grid}>
              <Grid item xs={12} md={6}> 
              <div className={styles.mainText}>
                <h1>Anti-Cheating AI <br/>for <span>students</span><br/>taking online exams.</h1>
              </div>
              </Grid>
              
              <Grid item xs={12} md={6}> 
                <div className={styles.landin}>
                  <Image src={Landin} />
                </div>
              </Grid>

           </Grid>

{/*            <Grid container className={styles.Grid}>
            <Grid item xs={12} md={4}>
              <div>
                <CheckCircleIcon fontSize="large" style={{ color:green[500]}}></CheckCircleIcon>
                <p> hi</p>
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <p> hi</p>
            </Grid>

            <Grid item xs={12} md={4}>
              <p> hi</p>
            </Grid>
             
           </Grid>   */}
           

           {/*    <div className={styles.logo} >
                <Image  src={Logo} alt="ProctorUTS Logo" />
              </div> */}
{/* 
              <p className={styles.description}>
                An Anti-Cheating Online Exam System with Privacy Protection 
              </p> */}
           {/*  <div className={styles.grid}>
              <Link href="/login" className={styles.card}>
                <div className={styles.card}>
                  <h2>Login &rarr;</h2>
                  <p>Login with your UTS Student or UTS Staff credentials</p>
                </div>
              </Link> */}

            {/*   <Link href="https://www.uts.edu.au/current-students/managing-your-course/classes-and-assessment/exams/online-exams"  className={styles.card}>
                
                <div className={styles.card}>
                  <h2>About &rarr;</h2>
                  <p>Find out information about online exams at UTS</p>
                </div>
              </Link>
 */}
        {/*       <Link
                href="/contact"
                className={styles.card}
              >
                <div className={styles.card}>
                  <h2>Contact &rarr;</h2>
                  <p>Contact ProctorUTS Admin team if you are experiencing any issues</p>
                </div>
              </Link> */}

        {/*       <Link
                href="/helpandfaq"
                className={styles.card}
              >
                <div className={styles.card}>
                  <h2>FAQ &rarr;</h2>
                  <p>
                  Get answers fast
                </p>
                </div>
              </Link>
            </div>  */}

            
          </main>
      </div>
      <Footer></Footer>
    </div>
  )
}