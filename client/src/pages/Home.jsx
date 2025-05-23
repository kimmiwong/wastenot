import { Link } from 'react-router-dom'
import ShowItems from '../components/ShowItems'
import AddItem from '../components/AddItem'
import SimpleHeader from '../components/Header'

export default function Home() {
    return (
        <div>
            <SimpleHeader />
            <div>
                <AddItem />
                <ShowItems />
            </div>
            <Link to='/Recipe'>Recipe Page</Link>
        </div >
    )
}
