import { Box } from "@mantine/core";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WasteNotLogo from "../assets/WasteNotLogo.png";
import classes from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function SimpleHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications");
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      const json = await res.json();
      setNotifications(json);
    } catch (error) {
      console.error("Error occurred while loading recipes.", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
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
              <img
                src={WasteNotLogo}
                alt="WasteNot Logo"
                className={classes.logo}
              />
            </Link>
            <span className={classes.logoText}>WasteNot</span>
          </div>
          <Link to="/Favorites" className="favorite-link">
            <FontAwesomeIcon icon={faHeart} style={{ color: "#eb6424" }} />
          </Link>
          <div className="dropdown-wrapper">
            <div className="dropdown-button" onClick={toggleOpen}>
              {notifications.length > 0 && (
                <span className="notification">({notifications.length})</span>
              )}
              <FontAwesomeIcon icon={faBell} />
              {isOpen && (
                <div className="dropdown">
                  <div>
                    <h2>Notifications</h2>
                    {notifications.length > 0 ? (
                      <ul>
                        {notifications.map((notification) => (
                          <li key={notification.notification_id}>
                            {notification.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nothing expiring yet!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </Box>
  );
}
