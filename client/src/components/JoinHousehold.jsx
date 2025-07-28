import { useState, useEffect } from "react";

export default function JoinHousehold() {
    const [alreadyInHousehold, setAlreadyInHousehold] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [inviteId, setInviteId] = useState("");

    useEffect(() => {

        const checkHouseholdStatus = async () => {
            try {
                const apiHost = import.meta.env.VITE_API_HOST;
                const response = await fetch(`${apiHost}/api/households/current`, {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    setAlreadyInHousehold(true);
                }
                const data = await response.json()
            }

            catch (error) {
                setAlreadyInHousehold(false);

            }

        };
        checkHouseholdStatus();
    }, [])


    const handleJoin = async () => {

        try {
            const apiHost = import.meta.env.VITE_API_HOST;
            const response = await fetch(`${apiHost}/api/households/join/${inviteId}`, {
                method: "POST",
                credentials: "include",

            });

            if (!response.ok) {
                throw new Error('Failed to join household')

            }

            if (response.ok) {
                setIsOpen(false);
                setError("");
                setAlreadyInHousehold(true);
            }

        } catch (error) {
            console.error('Error joining household')
            setError(error.message)

        }

    };
    if (alreadyInHousehold) return null;

    return (
        <>
            <button className="invite-button" onClick={() => setIsOpen(true)}>Join Household</button>
            {isOpen && <div className="household-modal-overlay">
                <div className="household-modal-box">
                    <h2>Enter Invite ID</h2>
                    <input
                        className="household-input"
                        type="text"
                        onChange={(e) => setInviteId(e.target.value)}
                        placeholder="Enter Invite ID"
                    />
                    <button onClick={handleJoin} className="join-button">Join Household</button>
                    <button onClick={() => setIsOpen(false)} className="close">X</button>

                </div>
            </div>}
        </>
    )

}
