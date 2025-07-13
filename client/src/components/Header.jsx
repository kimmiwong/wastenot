import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import WasteNotLogo from "../assets/WasteNotLogo.png";
import compostLogo from "../assets/compostLogo.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../context/NotificationsContext";
import { useUser } from "../context/UserProvider";
import classes from "./Header.module.css";

export default function SimpleHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, fetchNotifications } = useNotifications();
  const { user } = useUser();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <div className={classes.leftSection}>
          <Link to="/Home">
            <img src={WasteNotLogo} alt="Logo" className={classes.logo} />
          </Link>
          <span className={classes.logoText}>WasteNot</span>
        </div>

        <div className={classes.rightSection}>
          {user && (
            <div className={classes.userInfo}>
              <div className={classes.welcomeMessage}>
                Welcome, <strong>{user.username}</strong>
              </div>
              <Link to="/logout" className={classes.logOut}>
                Logout
              </Link>
            </div>
          )}

          <div className={classes.notifications} ref={dropdownRef}>
            <div
              className={classes.dropdownButton}
              onClick={() => setNotifOpen((prev) => !prev)}
            >
              {notifications.length > 0 && (
                <span className={classes.notification}>
                  ({notifications.length})
                </span>
              )}
              <FontAwesomeIcon icon={faBell} />
            </div>

            {notifOpen && (
              <div className={classes.dropdown}>
                <h4>Notifications</h4>
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((n) => (
                      <li key={n.notification_id}>{n.message}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Nothing expiring yet!</p>
                )}
              </div>
            )}
          </div>

          <button
            className={classes.hamburger}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>


      </div>

      {menuOpen && (
        <nav className={classes.mobileMenu}>
          {user && (
            <>
              <p>
                Welcome, <strong>{user.username}</strong>
              </p>
            </>
          )}
          <Link to="/Home" className={classes.menuItem}>Home</Link>
          <Link to="/Favorites" className={classes.menuItem}>Favorites</Link>
          <Link to="/Compost" className={classes.menuItem}>Compost Locations</Link>
        </nav>
      )
      }
    </header >
  );
}
