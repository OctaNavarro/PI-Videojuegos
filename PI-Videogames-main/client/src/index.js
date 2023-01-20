import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from './Store'
// import dotenv from "dotenv"

// dotenv.config()
axios.defaults.baseURL = 'pi-videojuegos-production.up.railway.app/' || "http://localhost:3001/"

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

reportWebVitals()
