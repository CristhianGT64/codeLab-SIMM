import { Link, Outlet } from 'react-router'
import './App.css'

function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-bold">CodeLab</h1>
      <nav className="mb-6 flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca</Link>
      </nav>
      <Outlet />
    </main>
  )
}

export default App
