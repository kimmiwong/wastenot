import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import WasteNotLogo from "../assets/WasteNotLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../context/NotificationsContext";
import { useUser } from "../context/UserProvider";
import classes from "./Header.module.css";

export default function SimpleHeader({ minimal = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, fetchNotifications } = useNotifications();
  const { user } = useUser();
  const [householdName, setHouseholdName] = useState("");
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const apiHost = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${apiHost}/api/households/current`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Could not fetch household");

        const data = await response.json();
        setHouseholdName(data.name);
      } catch (err) {
        console.error("Error fetching household:", err);
      }
    };

    fetchNotifications();
    fetchHousehold();
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
          {minimal ? (

            <Link to="/login" className={classes.logOut}>
              Login
            </Link>
          ) : (

            <>
              {user && (
                <div className={classes.userInfo}>
                  <div className={classes.welcomeMessage}>
                    {householdName ? (
                      <>Welcome to the <strong>{householdName} Household</strong></>
                    ) : (
                      <>You are not in a household yet</>
                    )}
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
            </>
          )}
        </div>
      </div>

      {!minimal && menuOpen && (
        <>
          <div
            className={classes.backdrop}
            onClick={() => setMenuOpen(false)}
          />
          <nav className={classes.mobileMenu} ref={menuRef}>
            {user && (
              <div className={classes.welcomeHousehold}>
                <p>
                  Welcome, <strong>{user.username}</strong>
                </p>
                {householdName && (<p> You are in <strong>{householdName}</strong>'s household </p>)}
                <Link to="/logout" className={classes.mobileLogout}>
                  Logout
                </Link>
              </div>
            )}
            <Link to="/Home" className={classes.menuItem}>
              Home
            </Link>
            <Link to="/Favorites" className={classes.menuItem}>
              Favorites
            </Link>
            <Link to="/Compost" className={classes.menuItem}>
              Compost Locations
            </Link>
            <Link to="/HouseholdInfo" className={classes.menuItem}> Settings</Link>
          </nav>
        </>
      )}
    </header>
  );
}
