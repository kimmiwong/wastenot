import React from 'react';
import { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from './Header';
import rebeccaImg from '../assets/Rebecca.jpg';
import lindseyImg from '../assets/Lindsey.png';
import kimmiImg from '../assets/Kimmi.png';
import jonathanImg from '../assets/Jonathan.png';
import HomePage from '../assets/HomePage.png';
import RecipeRecs from '../assets/Reciperecs.png';
import CompostPage from '../assets/Compost.png';


const teamMembers = [
    { name: "Rebecca Loewenstein-Harting", role: "Product Manager", img: rebeccaImg },
    { name: "Lindsey Lawson", role: "Front-End Developer", img: lindseyImg },
    { name: "Kimmi Wong", role: "Backend-End Developer", img: kimmiImg },
    { name: "Jonathan Kwan", role: "Backend-End Developer", img: jonathanImg },
];

const slides = [
    {
        image: HomePage,
        textContent: [
            { type: "paragraph", text: "Your Food, Your Control" },
            { type: "paragraph", text: "Keep track of every ingredient in your kitchen. WasteNot helps you see what you have, when it expires, and how to use it — all in one simple dashboard." }
        ]
    },
    {
        image: RecipeRecs,
        textContent: [
            { type: "paragraph", text: "Cook Smarter, Waste Less" },
            { type: "paragraph", text: "Enter the ingredients you already own and get personalized recipe ideas. WasteNot turns what you have into delicious meals — saving you money and reducing waste." }
        ]
    },
    {
        image: CompostPage,
        textContent: [
            { type: "paragraph", text: "Make Waste Work for You" },
            { type: "paragraph", text: "When food can’t be saved, WasteNot guides you on how to compost at home or find local drop-off spots, keeping organic waste out of landfills." }
        ]
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);


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
            </section>

            <section className={styles.about}>
                <h2>WasteNot Features</h2>

                <div className={styles.carousel}>

                    <div
                        className={styles.carouselTrack}
                        style={{ '--current-slide': current }}
                    >
                        {slides.map((slide, index) => (
                            <div key={index} className={styles.carouselSlide}>
                                <img src={slide.image} alt={`Screenshot ${index + 1}`} />
                                <div className={styles.carouselText}>
                                    {slide.textContent.map((content, i) =>
                                        content.type === "paragraph" ? (
                                            <p key={i}>{content.text}</p>
                                        ) : (
                                            <ul key={i}>
                                                {content.items.map((item, j) => (
                                                    <li key={j}>{item}</li>
                                                ))}
                                            </ul>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.carouselDots}>
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={index === current ? `${styles.dot} ${styles.active}` : styles.dot}
                            onClick={() => setCurrent(index)}
                        ></span>
                    ))}
                </div>
            </section>


            <section className={styles.grid}>
                <div className={styles.teamIntro}>
                    <h2>Our Team</h2>
                    <p>
                        Dedicated individuals passionate about reducing waste.
                        Meet the diverse team driving innovation and shaping the future of WasteNot.
                    </p>
                </div>

                {teamMembers.map((member, index) => (
                    <div key={index} className={styles.teamCard}>
                        <img src={member.img} alt={member.name} />
                        <div className={styles.overlay}>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className={styles.story}>
                <h2>Our Mission</h2>
                <p>
                    At WasteNot, our mission is to reduce food waste by empowering individuals to track expiration dates, discover creative recipes, and make informed decisions about their food. We believe that small, everyday actions can create a significant impact — saving money, conserving resources, and protecting our planet.
                </p>
            </section>


            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} WasteNot • Built with ❤️ by WasteNot</p>
            </footer>
        </div >
    );
}
