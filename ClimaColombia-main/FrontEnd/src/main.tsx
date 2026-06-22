import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Map from './map'
import './styles/App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='w-container'>
      <div className='w-screen h-screen'>
        <Map />
      </div>
    </div>
  </StrictMode>,
)
