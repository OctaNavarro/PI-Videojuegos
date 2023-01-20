import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Home from './components/Home'
import VideogameCreate from './components/VideogameCreate'
import Detail from './components/Detail'
import React from 'react'


function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/videogames' component={VideogameCreate} />
          <Route exact path='/home/:id' component={Detail} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
