import { Link } from 'react-router-dom'
import ShowItems from '../components/ShowItems'
import AddItem from '../components/AddItem'
import SimpleHeader from '../components/Header'

export default function Home() {
    return (
        <div className='page-content'>
            <SimpleHeader />
            <div>
                <AddItem />
                <ShowItems />
            </div>
            <div className="recipe-button-wrapper">
                <Link to="/recipe" className="recipe-button">
                    Generate Recipe
                </Link>
            </div>
        </div >
    )
}
