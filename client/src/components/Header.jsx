import { Box } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import WasteNotLogo from "../assets/WasteNotLogo.png";
import classes from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../context/NotificationsContext"
import compostLogo from "../assets/compostLogo.PNG";

export default function SimpleHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Box>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <div className={classes.leftSection}>
                        <Link to="/">
                            <img src={WasteNotLogo} alt="WasteNot Logo" className={classes.logo} />
                        </Link>
                        <span className={classes.logoText}>WasteNot</span>
                    </div>

                    <div className="right-section">
                        <div className="icon-tooltip-wrapper">
                            <Link to="/Compost" className="compost-link">
                                <img src={compostLogo} alt="Compost Link" className="compost-logo" />
                                <span className="tooltip-text">Compost Locations</span>
                            </Link>
                        </div>
                        <div className="fav-wrapper icon-tooltip-wrapper">
                            <Link to="/Favorites" className="favorite-link">
                                <FontAwesomeIcon icon={faHeart} style={{ color: "#eb6424" }} />
                                <span className="tooltip-text">Favorites</span>
                            </Link>
                        </div>

                        <div className="dropdown-wrapper" ref={dropdownRef}>
                            <div className="dropdown-button" onClick={toggleOpen}>
                                {notifications.length > 0 && (
                                    <span className="notification">({notifications.length})</span>
                                )}
                                <FontAwesomeIcon icon={faBell} />
                                {isOpen && (
                                    <div className="dropdown">
                                        <h2>Notifications</h2>
                                        {notifications.length > 0 ? (
                                            <ul>
                                                {notifications.map((notification) => (
                                                    <li key={notification.notification_id}>{notification.message}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Nothing expiring yet!</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </Box>
    );
}
