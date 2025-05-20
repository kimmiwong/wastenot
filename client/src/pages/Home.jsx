import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <h1>Hello World</h1>
            <Link to='/Recipe'>Recipe Page</Link>
        </div >
    )
}
