import styles from './Drivers.module.css';
import { useState, useEffect } from 'react';

// Add this interface for driver data
interface Driver {
    _id: string;
    name: string;
    employeeId?: string;
    status: string;
}

const Drivers = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]); // Add type here
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('Please log in first');
                    setLoading(false);
                    return;
                }

                console.log('Fetching drivers with token...');
                
                const response = await fetch('https://logigas-backend.onrender.com/api/drivers', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Drivers response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch drivers: ${response.status}`);
                }

                const data = await response.json();
                console.log('Drivers data received:', data);
                
                setDrivers(data);
                setError('');

            } catch (error) {
                console.error('Error fetching drivers:', error);
                setError('Failed to load drivers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) {
        return (
            <div className={styles.drivers}>
                <table className={styles.driversInfo}>
                    <tbody>
                        <tr>
                            <th>Drivers</th>
                            <th>Status</th>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{textAlign: 'center', padding: '2rem'}}>
                                Loading drivers...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.drivers}>
                <table className={styles.driversInfo}>
                    <tbody>
                        <tr>
                            <th>Drivers</th>
                            <th>Status</th>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{textAlign: 'center', padding: '2rem', color: 'red'}}>
                                {error}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={styles.drivers}>
            <table className={styles.driversInfo}>
                <tbody>
                    <tr>
                        <th>Drivers</th>
                        <th>Status</th>
                    </tr>

                    {drivers.length > 0 ? (
                        drivers.map(driver => (
                            <tr key={driver._id} className={styles.driver}>
                                <td>
                                    <img src="logo2.png" className={styles.driverImage} alt="Driver" />
                                </td>
                                <td>
                                    <h4 className={styles.driverName}>Name: {driver.name}</h4>
                                    <p className={styles.employeeID}>Employee ID: {driver.employeeId || driver._id?.slice(-8)}</p>
                                    <p className={styles.status}>Status: {driver.status}</p>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} style={{textAlign: 'center', padding: '2rem'}}>
                                No drivers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Drivers;