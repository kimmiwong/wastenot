import { Link } from 'react-router-dom'
import ShowItems from '../components/ShowItems'

export default function Home() {
    return (
        <div>
            <h1>WasteNot</h1>
            <div>
                <ShowItems />
            </div>
            <Link to='/Recipe'>Recipe Page</Link>
        </div >
    )
}
