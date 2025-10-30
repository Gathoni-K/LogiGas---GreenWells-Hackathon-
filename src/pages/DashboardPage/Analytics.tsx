import styles from './Analytics.module.css';
import { GiPathDistance } from "react-icons/gi";
import { BsFuelPump } from "react-icons/bs";

const Analytics = () => {
    return (
        <div className={styles.analytics}>
            <h3 className={styles.distance}>
                <GiPathDistance />
                Distance Saved: 5km </h3>
            <p className={styles.fuel}>
                <BsFuelPump />
                Fuel Saved: 1247L</p>
        </div>
    )
}

export default Analytics