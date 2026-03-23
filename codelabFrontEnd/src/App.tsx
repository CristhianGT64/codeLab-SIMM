import AppRouter from './router'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className='App'>
      <Toaster position="top-right" richColors />
      <AppRouter/>
    </div>
  )
}
export default App
