import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import theOffice from '../src/Images/theOffice.gif'

const NotFound = () => {
    return (
        <div className={styles.error404} >
            <h1 className={styles.title}>Error 404</h1>
            <h1 className={styles.description}>After a long look around campus...</h1>
            <h2 className={styles.description}>This page cannot be found</h2>
            <p align="center">Go back to the <Link href="/"><a>Homepage</a></Link></p>
            <div className={styles.giff} >
                <Image  src={theOffice} alt="Michael Scott Dance" />
            </div>
        </div>
    );
}

export default NotFound;