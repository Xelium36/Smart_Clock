import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'

// C'EST ICI QUE CA SE JOUE :
// On charge explicitement 'app.css' où on a mis le bouton bleu.
import './app.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)