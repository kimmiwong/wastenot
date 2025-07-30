import { useEffect, useState } from "react";

export default function HouseholdInfo() {
const [membershipList, setMembershipList] = useState([])

useEffect(() => {
    const fetchHouseholdMembers = async () => {
      try {
        const apiHost = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${apiHost}/api/households/memberships`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Could not fetch memberships");

        const data = await response.json();
        setMembershipList(data);
      } catch (error) {
        console.error("Error fetching household:", error);
      }
    };

    fetchHouseholdMembers();
  }, []);


  return (
    <>
    <div>
        <h2>Household Members</h2>
        <ul>
            {membershipList.map((item) =>
            <li key={item.id}>
                {item.username}
            </li>

        )}
        </ul>
    </div>
    </>
  )




  }
