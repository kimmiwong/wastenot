import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteHouseholdMember from "../components/InviteHouseholdMember";
import ResetPassword from "./ResetPassword";

export default function HouseholdInfo() {
  const [membershipList, setMembershipList] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouseholdInfo = async () => {

      try {
        const apiHost = import.meta.env.VITE_API_HOST;

        // fetch household data
        const householdResponse = await fetch(`${apiHost}/api/households/current`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!householdResponse.ok) {
          throw new Error('Failed to fetch household');
        }

        const householdData = await householdResponse.json();
        setHousehold(householdData);

        // fetch current user's membership
        const userMembershipResponse = await fetch(`${apiHost}/api/households/me/membership`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!userMembershipResponse.ok) {

          throw new Error('Failed to fetch membership');
        }

        const userMembershipData = await userMembershipResponse.json();

        if (householdData.admin_user_id === userMembershipData.user_id) {
          setIsAdmin(true)
        }

        // fetch all household memberships
        const membershipsResponse = await fetch(`${apiHost}/api/households/memberships`, {
          method: 'GET',
          credentials: "include",
        });
        if (!membershipsResponse.ok) throw new Error("Could not fetch memberships");

        const membershipsData = await membershipsResponse.json();
        setMembershipList(membershipsData);


      } catch (error) {
        console.error('Error fetching household data');
        setError(error.message);
      } finally {
        setLoading(false);
      }

    };
    fetchHouseholdInfo()
  }, []);

  async function handleLeaveHousehold() {
    const confirmLeave = window.confirm("Are you sure you want to leave this household?");
    if (!confirmLeave) return;

    const apiHost = import.meta.env.VITE_API_HOST;
    try {
      const res = await fetch(`${apiHost}/api/households/me/membership`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Could not leave household");

      alert("Left household successfully");

      // Navigate home with a state flag
      navigate("/Home", { state: { householdLeft: true } });

    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteHousehold() {
    const confirmDelete = window.confirm("Are you sure you want to delete this household?");
    if (!confirmDelete) return;

    const apiHost = import.meta.env.VITE_API_HOST;
    try {
      const res = await fetch(`${apiHost}/api/households/current`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Could not delete household");

      alert("Household deleted successfully");

      navigate("/Home", { state: { householdLeft: true } });

    } catch (err) {
      console.error(err);
    }
  }




  async function handleRemoveHouseholdMember(userId) {
    const confirmDelete = window.confirm("Are you sure you want to remove this member? This action cannot be undone")
    if (!confirmDelete) return;

    const apiHost = import.meta.env.VITE_API_HOST;

    try {
      const res = await fetch(`${apiHost}/api/households/memberships/${userId}`, {
        method: 'DELETE',
        credentials: "include",
      });

      if (!res.ok) throw new Error("Could not remove member");

      alert("Removed member successfully")

      navigate(0);

    } catch (error) {
      console.error('Error removing member', error)

    }

  }

  async function transferAdminRights(userId) {
    const confirmTransfer = window.confirm("Are you sure you want to reassign admin rights?")
    if (!confirmTransfer) return;

    const apiHost = import.meta.env.VITE_API_HOST;

    try {
      const res = await fetch(`${apiHost}/api/households/current/admin`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ admin_user_id: userId })
      });

      if (!res.ok) throw new Error("Could not transfer admin rights");

      alert("Admin rights transferred successfully")

      navigate(0);

    } catch (error) {
      console.error('Error transferring admin rights', error)

    }

  }

  if (loading) return <p>Loading household info...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="settings-container">
        <div className="settings-header">
          {isAdmin ? (
            <>
              <h1 className="settings-title">You are the admin of {household.name}</h1>
              <button className="settings-button delete" onClick={handleDeleteHousehold}>
                Delete Household
              </button>
            </>
          ) : (
            <>
              <h1 className="settings-title">You are a member of {household.name}</h1>
              <button className="settings-button leave" onClick={handleLeaveHousehold}>
                Leave Household
              </button>
            </>
          )}
          <InviteHouseholdMember />
        </div>

        <div className="settings-members">
          <h2 className="settings-subtitle">Household Members</h2>
          <ul className="settings-member-list">
            {membershipList.map((item) => (
              <li key={item.id} className="settings-member-item">
                <span>{item.username}</span>
                {item.user_id === household.admin_user_id && (
                  <span className="settings-badge">Admin</span>
                )}
                {isAdmin && item.user_id !== household.admin_user_id && (
                  <div className="settings-member-actions">
                    <button
                      className="settings-button small danger"
                      onClick={() => handleRemoveHouseholdMember(item.user_id)}
                    >
                      Remove
                    </button>
                    <button
                      className="settings-button small"
                      onClick={() => transferAdminRights(item.user_id)}
                    >
                      Make Admin
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="reset-password">
        <ResetPassword />
      </div>
    </div>

  );
}
