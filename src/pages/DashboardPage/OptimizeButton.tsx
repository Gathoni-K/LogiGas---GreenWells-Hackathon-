import styles from './OptimizeButton.module.css';

const OptimizeButton = ({ onClick, disabled }) => {
    return (
        <div className={styles.optimize}>
            <button className={styles.button} onClick={onClick} disaled={disabled}>Optimize Route</button>
        </div>
    )
}

export default OptimizeButton