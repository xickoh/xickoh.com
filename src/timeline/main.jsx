import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './timeline.css'
import Timeline from './Timeline.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Timeline />
  </StrictMode>,
)
