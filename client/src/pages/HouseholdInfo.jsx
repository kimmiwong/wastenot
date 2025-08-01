import { useEffect, useState } from "react";

export default function HouseholdInfo() {
const [membershipList, setMembershipList] = useState([]);
const [error, setError] = useState(null);
const [isAdmin, setIsAdmin] = useState(false);
const [household, setHousehold] = useState(null);
const [loading, setLoading] = useState(true);

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
        console.log(data)
      } catch (error) {
        console.error("Error fetching household:", error);
      }
    };

    fetchHouseholdMembers();
  }, []);

  useEffect(() => {
    const fetchHouseholdInfo = async () => {

        try {
            const apiHost = import.meta.env.VITE_API_HOST;

            const householdResponse = await fetch(`${apiHost}/api/households/current`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!householdResponse.ok) {
                throw new Error('Failed to fetch household');
            }

            const householdData = await householdResponse.json();
            setHousehold(householdData);

            const membershipResponse = await fetch(`${apiHost}/api/households/me/membership`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!membershipResponse.ok) {

                throw new Error('Failed to fetch membership');
            }

            const membershipData = await membershipResponse.json();

            if (householdData.admin_user_id === membershipData.user_id) {
                setIsAdmin(true)
            }

        } catch (error) {
            console.error('Error fetching household data');
            setError(error.message);
        } finally {
          setLoading(false);
        }

    };
    fetchHouseholdInfo()
}, []);

if (loading) return <p>Loading household info...</p>;
if (error) return <p>{error}</p>;

  return (
    <>
    <div>
      {isAdmin ? (
        <div>
          <h1>You are the admin of {household.name} </h1>
        </div>
      ): (
        <div>
          <h1>You are a member of {household.name}</h1>
        </div>
      )}
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
