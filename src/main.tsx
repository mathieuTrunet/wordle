import React from 'react'
import ReactDOM from 'react-dom/client'
import { Wordle } from './Wordle.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Wordle />
  </React.StrictMode>
)
