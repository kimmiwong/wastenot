import { useState, useEffect } from "react";

export default function InviteHouseholdMember () {

    const [error, setError] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [inviteId, setInviteId] = useState("");
    const [isOpen, setIsOpen] = useState(false);



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
                    setInviteId(householdData.invite_id)

                    const membershipResponse = await fetch(`${apiHost}/api/households/me/membership`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (!membershipResponse.ok) {

                        throw new Error('Failed to fetch membership');
                    }

                    const membershipData = await membershipResponse.json();

                    if (householdData.admin_user_id === membershipData.user_id) {
                        setAdmin(true)
                    }
                    console.log(admin)


                } catch (error) {
                    console.error('Error fetching household data');
                    setError(error.message);
                }

            }
            fetchHouseholdInfo()
        }, []);

        if (!admin) return null;


    return (
        <>

            <button onClick={() => setIsOpen(true) }>Invite Household Member</button>
            {isOpen && <div className="household-modal-overlay">
                <div className="household-modal-box">
                    <h2>Share Invite ID:</h2>
                        <input
                            type="text"
                            className="household-input"
                            value={inviteId}
                            readOnly
                            onClick={(e) => e.target.select()}
                        />
                        {error && <p className="error-text">{error}</p>}
                        <button onClick={() => setIsOpen(false)}>Close</button>
                </div>
            </div>}
        </>
    )
}
