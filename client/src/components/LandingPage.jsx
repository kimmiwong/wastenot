import React from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from './Header';

export default function LandingPage() {
    const navigate = useNavigate();

    function handleGetStarted() {
        navigate("/login?signup=true");
    }
    return (
        <div className={styles.page}>
            <SimpleHeader minimal />

            <section className={styles.hero}>
                <h1>Your Waste Free App.</h1>
                <p>WasteNot helps you track groceries, cook creatively, and reduce food waste all in one.</p>
                <button className={styles.getStarted} onClick={handleGetStarted}>Get Started</button>
                <button className={styles.cta}>Features</button>
            </section>

            <section className={styles.about}>
                <p>About</p>
            </section>

            <section className={styles.grid}>
                <p>Our team</p>
            </section>

            <section className={styles.story}>
                <h2>Our Mission</h2>
                <p>
                    Born from the desire to reduce food waste, WastNot empowers households to track their food, save money, and minimize waste.
                </p>
            </section>


            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} WastNot • Built with ❤️ by Lindsey</p>
            </footer>
        </div >
    );
}
