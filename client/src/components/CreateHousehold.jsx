import { useState } from "react";
import { useNavigate } from "react-router";


export default function CreateHousehold({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [name, setName] = useState('')

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiHost = import.meta.env.VITE_API_HOST;

            const response = await fetch(`${apiHost}/api/households`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    'name': name
                })

            });

            if (!response.ok) throw new Error('Failed to create household')
        }

        catch (error) {
            console.error('Error creating household')

        }

        navigate('/Home');
    }

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
