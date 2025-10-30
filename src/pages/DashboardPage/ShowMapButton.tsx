import styles from './ShowMapButton.module.css';
import { FaMapMarkerAlt } from "react-icons/fa";

const ShowMapButton = ( { onClick }) => {
    return (
        <div className={styles.showMap}>
            <h3 className={styles.heading}>Live Map</h3>
            <button className={styles.button} onClick={onClick}>
                <FaMapMarkerAlt />
                Show on Map</button>
        </div>
    )
}

export default ShowMapButton