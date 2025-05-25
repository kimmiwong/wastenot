export default function ItemTable({ children }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="item-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Expiration Date</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}
