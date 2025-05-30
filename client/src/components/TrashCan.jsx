import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function TrashCan({ onDelete }) {
    return (
        <div className="trash-container">
            <button onClick={onDelete}>
                <FaTrash />
            </button>
        </div>
    );
}
