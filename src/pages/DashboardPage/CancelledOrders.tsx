import styles from './CancelledOrder.module.css';
const CancelledOrders = () => {
    return (
        <div className={styles.cancelledOrders}>
            <h3 className={styles.order}>Cancelled Orders</h3>
            <p className={styles.tally}>30</p>
        </div>
    )
    }

export default CancelledOrders
