import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserProvider";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children, shouldFetch = true }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUser();
  const apiHost = import.meta.env.VITE_API_HOST;

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${apiHost}/api/notifications`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      const json = await res.json();
      setNotifications(json);
    } catch (error) {
      if (import.meta.env.DEV && error.message !== "401") {
        console.warn("Could not load notifications:", error.message);
      }
    }
  };

  useEffect(() => {
    if (!shouldFetch || !user) return;

    const timeout = setTimeout(() => {
      if (user) {
        fetchNotifications();
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [user, shouldFetch]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, fetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
