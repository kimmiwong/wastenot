import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HouseholdOnboarding({ householdLeft, setHouseholdLeft }) {
    const [isOpen, setIsOpen] = useState(false);
    const [alreadyInHousehold, setAlreadyInHousehold] = useState(false);
    const [showTab, setShowTab] = useState("join");
    const [inviteId, setInviteId] = useState("");
    const [householdName, setHouseholdName] = useState("");
    const [error, setError] = useState("");

    const location = useLocation();

    const resetHouseholdOnboarding = () => {
        setAlreadyInHousehold(false);
        setIsOpen(true);
        setShowTab("join");
        setInviteId("");
        setHouseholdName("");
        setError("");
    };

    useEffect(() => {
        const checkHouseholdStatus = async () => {
            try {
                const apiHost = import.meta.env.VITE_API_HOST;
                const response = await fetch(`${apiHost}/api/households/current`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    setAlreadyInHousehold(false);
                    setIsOpen(true);
                } else {
                    setAlreadyInHousehold(true);
                    setIsOpen(false);
                }
            } catch {
                setAlreadyInHousehold(false);
                setIsOpen(true);
            }
        };
        checkHouseholdStatus();
    }, []);

    useEffect(() => {
        if (location.state?.householdLeft) {
            resetHouseholdOnboarding();
        }
    }, [location.state]);

    useEffect(() => {
        if (householdLeft) {
            resetHouseholdOnboarding();
            setHouseholdLeft(false);
        }
    }, [householdLeft, setHouseholdLeft]);

    const handleJoin = async () => {
        try {
            const apiHost = import.meta.env.VITE_API_HOST;
            const response = await fetch(`${apiHost}/api/households/join/${inviteId}`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to join household");

            setIsOpen(false);
            setAlreadyInHousehold(true);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreate = async () => {
        try {
            const apiHost = import.meta.env.VITE_API_HOST;
            const response = await fetch(`${apiHost}/api/households`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: householdName }),
            });

            if (!response.ok) throw new Error("Failed to create household");

            setIsOpen(false);
            setAlreadyInHousehold(true);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="household-modal-overlay">
                    <div className="household-modal-box">
                        <h2>Welcome! Get started with your household</h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <button className="join-button" onClick={() => setShowTab("join")}>Join Household</button>
                            <button className="join-button" onClick={() => setShowTab("create")}>Create Household</button>
                        </div>

                        {showTab === "join" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Invite ID"
                                    value={inviteId}
                                    onChange={(e) => setInviteId(e.target.value)}
                                    className="household-input"
                                />
                                <button className="join-button" onClick={handleJoin}>Join</button>
                            </div>
                        )}

                        {showTab === "create" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Household Name"
                                    value={householdName}
                                    onChange={(e) => setHouseholdName(e.target.value)}
                                    className="household-input"
                                />
                                <button className="join-button" onClick={handleCreate}>Create</button>
                            </div>
                        )}

                        {error && <p>{error}</p>}

                        <button className="close" onClick={() => setIsOpen(false)}>X</button>
                    </div>
                </div>
            )}
        </>
    );
}
