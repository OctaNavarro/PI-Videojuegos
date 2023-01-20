import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from './Store'
import dotenv from "dotenv"

dotenv.config()
axios.defaults.baseURL = process.env.URL_BACK || "http://localhost:3001/"

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

reportWebVitals()
