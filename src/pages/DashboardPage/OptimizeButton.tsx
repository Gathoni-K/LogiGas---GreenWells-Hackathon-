import styles from './OptimizeButton.module.css';

const OptimizeButton = ({ onClick, disabled }) => {
    return (
        <div className={styles.optimize}>
            <button className={styles.button} onClick={onClick} disabled={disabled}>Optimize Route</button>
        </div>
    )
}

export default OptimizeButton