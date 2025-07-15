import { useState } from "react";
import { useNavigate } from "react-router";


export default function CreateHousehold({ isOpen, onClose, onCreate }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const apiHost = import.meta.env.VITE_API_HOST;

            const response = await fetch(`${apiHost}/api/households`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to create household');
            }

            if (typeof onCreate === 'function') {
                await onCreate(name);
            }

            setName("");
            onClose();
        } catch (error) {
            console.error('Error creating household');
            setError(error.message);
        }
    };

    return (
        <div className="household-modal-overlay">
            <div className="household-modal-box">
                <h2>Create Household</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Household Name"
                        className="household-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {error && <p className="error-text">{error}</p>}
                    <div className="household-modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
