import styles from "../styles/modules/Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.footerContent}>

            <div className={styles.logo}> 
                <img src="logo.png" className={styles.image}/>
                <h2 className={styles.heading}>LogiGas</h2>
            </div>

            <div className={styles.footerLinks}>
                <a>User Guide </a>
                <a>IT Support </a>
                <a>System Status </a>
                <a>Feedback</a> 
            </div>

            <div className={styles.confidentialNotice}>
                <h4>Confidential & Proprietary - For Internal Use Only</h4>
            </div>


        </div>
    )
    }

export default Footer
