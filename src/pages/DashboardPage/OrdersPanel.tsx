/*
Parent component holding the three boxes containing all the information
about our orders, in here, the three independent children modules are rendered.

*/
import TotalOrders from "./TotalOrders";
import EnRouteOrders from "./EnRouteOrders";
import CancelledOrders from "./CancelledOrders";
import styles from "./OrdersPanel.module.css";

export default function OrdersPanel(){
    return(
        <div className={styles.orders}>
            <TotalOrders />
            <EnRouteOrders />
            <CancelledOrders />
        </div>
    )
}