import React from 'react'
import SidebarV2 from '../../components/dashComponents/SidebarV2'
import { Typography } from '@material-ui/core'


export default function help() {
    return (
        <div>
            <SidebarV2>
            <Typography variant="h5">
                <div className={styles.container}>
                   <div className={styles.centered}>Get in touch </div>
                   <div className={styles.centeredemail}>https://www.uts.edu.au/current-students/managing-your-course/ask-uts/ask-uts</div>
                   <div className={styles.centeredcontactnumber}>Monday - Friday, 9am - 5pm contact us on 1300 ASK UTS</div>
                 </div>
                </Typography>
            </SidebarV2>
        </div>
    )
}
