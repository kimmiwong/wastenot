import { Link } from 'react-router-dom'
import ShowItems from '../components/ShowItems'

export default function Home() {
    return (
        <div>
            <h1>Hello World</h1>
            <div>
                <ShowItems />
            </div>
            <Link to='/Recipe'>Recipe Page</Link>
        </div >
    )
}
