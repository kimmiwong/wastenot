import { useEffect, useState } from 'react'
import { TextInput, Select, Button } from '@mantine/core';
import ShelfLifeModal from './ShelflifeModal'


export default function AddItem() {



    const [name, setName] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [category, setCategory] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => { setIsModalOpen(true) }
    const closeModal = () => { setIsModalOpen(false) }

    const handleSubmit = async (e) => {

        console.log('form submitted', { name, expirationDate, category })



        try {

            const response = await fetch('http://localhost:8000/api/food-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'name': name,
                    'expiration_date': expirationDate,
                    'category_id': category
                })

            });

            if (!response.ok) throw new Error('Failed to add food item')

        }

        catch (error) {
            console.error('Error adding food item', error)

        }

    }


    return (

        <div className="top-section">
            <div className="form-overlay">
                <h2>Add new food item</h2>
                <form className="add-item-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Food Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor='expiration-date'>Expiration Date:</label>
                        <input type='date' id='expiration-date' value={expirationDate} onChange={e => setExpirationDate(e.target.value)}></input>

                    </div>

                    <div>
                        <button type="button" onClick={openModal}>No expiration date?</button>
                        <ShelfLifeModal isOpen={isModalOpen} closeModal={closeModal}>
                            <h2>Recommended shelf life:</h2>
                            <h3>Room temperature -</h3>
                            <ul>
                            <li>Apples 2-3 weeks</li>
                            <li>Avocados 3-7 days</li>
                            <li>Bananas 2-5 days</li>
                            <li>Citrus 1-2 weeks</li>
                            <li>Garlic 1-5 months</li>
                            <li>Melons 2-3 weeks</li>
                            <li>Onions 1-3 months</li>
                            <li>Peaches 2-4 weeks</li>
                            <li>Pears 2 weeks</li>
                            <li>Potatoes 1-5 months</li>
                            <li>Tomatoes 4-6 days</li>
                            </ul>

                            <h3>Refrigerated -</h3>
                            <ul>
                            <li>Apples 1-2 months</li>
                            <li>Berries 7-10 days</li>
                            <li>Broccoli 1-2 weeks</li>
                            <li>Cabbage 2 weeks</li>
                            <li>Cauliflower 2-4 weeks</li>
                            <li>Citrus 1 months</li>
                            <li>Cucumbers 1-2 weeks</li>
                            <li>Grapes 1-2 weeks</li>
                            <li>Greens 3-5 days</li>
                            <li>Herbs (Basil/Parsley/Cilantro) 3-5 days</li>
                            <li>Herbs (Rosemary/Mint) 1-3 weeks</li>
                            <li>Herbs (Thyme) 1-2 weeks</li>
                            <li>Lettuce 1 week</li>
                            <li>Peppers 2-3 weeks</li>
                            <li>Mushrooms 7-10 days</li>
                            <li>Root veggies 1-2 months</li>
                            <li>Zucchini 7-10 days</li>
                            </ul>

                        </ShelfLifeModal>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="1">Pantry</option>
                            <option value="2">Fridge/Freezer</option>
                        </select>
                    </div>

                    <button type="submit">Add Food Item</button>
                </form>
            </div >
        </div >


    )


}
