import { Link } from 'react-router-dom'
import ShowItems from '../components/ShowItems'
import AddItem from '../components/AddItem'

export default function Home() {
    return (
        <div>
            <h1>WasteNot</h1>
            <div>
                <AddItem />
                <ShowItems />
            </div>
            <Link to='/Recipe'>Recipe Page</Link>
        </div >
    )
}
