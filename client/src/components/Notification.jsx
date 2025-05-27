import { useState, useEffect } from "react"

export default function Notification () {

    const [notifications, setNotifications] = useState([])

    const fetchNotifications = async() => {

        try{

            const res = await fetch('http://localhost:8000/api/notifications');
            if (!res.ok) {
                throw new Error (`${res.status}`)
            }

            const json = await res.json()
            setNotifications(json)


        }

        catch (error) {
            console.error("Error occurred while loading recipes.", error);


        }


    }


useEffect (() => {
    fetchNotifications()
}, []);


return (

    <div>
       <h2>Notifications</h2>
       {notifications.length > 0 ? (
       <ul>
        {notifications.map((notification) => (
            <li key={notification.notification_id}>{notification.message}</li>
        ))}
       </ul>) :
       (<p>Nothing expiring within 2 days!</p>)}
    </div>

)

}
