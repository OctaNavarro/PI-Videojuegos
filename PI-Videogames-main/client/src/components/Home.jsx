import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getVideogames,
  filterVideogamesByGenre,
  filterCrated,
  orderByName,
  orderByRating,
} from '../actions'
import { Link } from 'react-router-dom'
import VgCard from './Cards'
import Paginado from './Paginado'
import SearchBar from './SearchBar'
import img from '../Imagenes/mario3d.png'


export default function Home() {
  const dispatch = useDispatch()
  const allVideogames = useSelector(state => state.videogames)
  const [currentPage, setCurrentPage] = useState(1)
  const [vgPerPage, setVgPerPage] = useState(15)
  const indexOfLastVg = currentPage * vgPerPage
  const indexOfFirstVg = indexOfLastVg - vgPerPage
  const currentVgs = allVideogames.slice(indexOfFirstVg, indexOfLastVg)
  const [render, setRender] = useState('')

  const paginado = pageNumber => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    dispatch(getVideogames())
  }, [dispatch])

  function handleClick(e) {
    e.preventDefault()
    dispatch(getVideogames())
  }

  function handleFilterGenre(e) {
    dispatch(filterVideogamesByGenre(e.target.value))
    setCurrentPage(1)
  }

  function handleFilterCreated(e) {
    dispatch(filterCrated(e.target.value))
    setCurrentPage(1)
  }

  function handleSortName(e) {
    e.preventDefault()
    dispatch(orderByName(e.target.value))
    setCurrentPage(1)
    setRender(`Render ${e.target.value}`)
  }

  function handleSortRating(e) {
    e.preventDefault()
    dispatch(orderByRating(e.target.value))
    setCurrentPage(1)
    setRender(`Render ${e.target.value}`)
  }

  return (
    <div>
      <Link to='/videogames'>Create videogame</Link>
      <button
        onClick={e => {
          handleClick(e)
        }}
      >
        Reload Videogames
      </button>
      <div>
        <select onChange={e => handleSortName(e)}>
          <option value='asc'>A to Z</option>
          <option value='desc'>Z to A</option>
        </select>
        <select onChange={e => handleSortRating(e)}>
          <option value='worst'>Worst to best</option>
          <option value='best'>Best to worst</option>
        </select>
        <select onChange={e => handleFilterGenre(e)}>
          <option value='All'>ALL</option>
          <option value='Action'>ACTION</option>
          <option value='Adventure'>ADVENTURE</option>
          <option value='Indie'>INDIE</option>
          <option value='RPG'>RPG</option>
          <option value='Strategy'>STRATEGY</option>
          <option value='Shooter'>SHOOTER</option>
          <option value='Casual'>CASUAL</option>
          <option value='Simulation'>SIMULATION</option>
          <option value='Puzzle'>PUZZLE</option>
          <option value='Arcade'>ARCADE</option>
          <option value='Platformer'>PLATFORMER</option>
          <option value='Racing'>RACING</option>
          <option value='Massively Multiplayer'>MMO</option>
          <option value='Sports'>SPORTS</option>
          <option value='Fighting'>FIGHTING</option>
          <option value='Family'>FAMILY</option>
          <option value='Educational'>EDUCATIONAL</option>
          <option value='Card'>CARD</option>
          <option value='Board Games'>BOARD GAMES</option>
        </select>
        <select onChange={e => handleFilterCreated(e)}>
          <option value='All'>All</option>
          <option value='Existing'>Exisisting</option>
          <option value='Created'>Created</option>
        </select>

        <Paginado
          vgPerPage={vgPerPage}
          allVideogames={allVideogames}
          paginado={paginado}
        />
      </div>
      <SearchBar />
      {currentVgs?.map(e => {
        return (
          <div>
            <Link to={'/home/' + e.id}>
              <VgCard
                name={e.name}
                image={
                  e.image.length > 0
                    ? e.image
                    : img
                }
                genre={e.genres.map(e => e.name + ', ')}
              />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
