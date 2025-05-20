import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Recipe from './pages/Recipe'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Recipe' element={<Recipe />} />
    </Routes>
  )
}
