/*
This is the component that holds the styles of our app.

*/
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/modules/MainLayout.module.css";

const MainLayout = ({ children }: {children:React.ReactNode}) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.mainContent}>
                {children}
                {/* this defines the part that changes throughout all our webpages */}
            </main>
            <Footer />
        </div>
    )
    }

export default MainLayout
