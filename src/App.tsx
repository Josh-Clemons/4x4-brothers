import clubLogo from './assets/4x4-brothers.jpg'
import './App.css'

function App() {

  return (
    <div style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${clubLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.2
    }}>

    </div>
  )
}

export default App
