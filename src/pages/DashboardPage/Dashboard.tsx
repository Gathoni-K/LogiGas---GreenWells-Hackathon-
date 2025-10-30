import OrdersPanel from './OrdersPanel';
import Map from './Map';
import Drivers from './Drivers';
import Analytics from './Analytics';
import MainLayout from '../../components/MainLayout';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div>
            <MainLayout>
            <OrdersPanel />
            <Map />
            <div className={styles.sideBySide}>
            <Drivers />
            <Analytics />
            </div>
            </MainLayout>
        </div>
    )
    }

export default Dashboard
