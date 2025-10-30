/*
This is the component holding our logo and the user profile.
-Will only have the app name and the features described above.
*/
import styles from "../styles/modules/Header.module.css";
import { CgProfile } from "react-icons/cg";


export default function Header() {
    return(
        <div className={styles.header}>
            <div className={styles.Logo}>
                <img src="logo.png" className={styles.logo} />
                <h2 className={styles.appName}>LogiGas</h2>
            </div>
            <div className={styles.userProfile}>
                <CgProfile />
            </div>
        </div>
    )
}