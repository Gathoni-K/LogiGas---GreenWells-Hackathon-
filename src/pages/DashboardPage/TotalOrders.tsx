import styles from './TotalOrders.module.css';

const TotalOrders = () => {
  return (
        <div className={styles.totalOrders}>
          <h3 className={styles.order}>Total Orders</h3>
          <p className={styles.tally}>30</p>
        </div>

  )
}

export default TotalOrders
