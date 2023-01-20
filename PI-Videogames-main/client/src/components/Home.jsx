import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getVideogames,
  filterVideogamesByGenre,
  filterCrated,
  orderByName,
  orderByRating,
  getGenres,
} from '../actions'
import { Link } from 'react-router-dom'
import VgCard from './Cards'
import Paginado from './Paginado'
import SearchBar from './SearchBar'
import img from '../Imagenes/mario3d.png'
import bgImg from '../Imagenes/jonathan-borba-ipmc5-Z-uwQ-unsplashLQ.jpg'
import '../App.css'
import styles from './Home.module.css'

export default function Home() {
  const dispatch = useDispatch()
  const allVideogames = useSelector(state => state.videogames)
  const [currentPage, setCurrentPage] = useState(1)
  const [vgPerPage, setVgPerPage] = useState(15)
  const indexOfLastVg = currentPage * vgPerPage
  const indexOfFirstVg = indexOfLastVg - vgPerPage
  let currentVgs = []
  if (Array.isArray(allVideogames)) {
    currentVgs = allVideogames.slice(indexOfFirstVg, indexOfLastVg)
  }
  const [render, setRender] = useState('')

  const paginado = pageNumber => {
    setCurrentPage(pageNumber)
  }

  function handleClick(e) {
    e.preventDefault()
    console.log('soy un boton')
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

  useEffect(() => {
    dispatch(getVideogames())
    dispatch(getGenres())
  }, [])

  return (
    <div className={styles.bg}>
      <div className={styles.nav}>
        <button
          onClick={e => {
            handleClick(e)
          }}
          className={styles.boton}
        >
          <img src={bgImg} className={styles.bgImg} alt='bg' />
        </button>
        <div className={styles.createBtnContainer}>
          <Link to='/videogames' className={styles.createBtn}>
            Create videogame!
          </Link>
        </div>
        <div>
          <select onChange={e => handleSortName(e)} className={styles.selector}>
            <option disabled>Alphabetical order</option>
            <option value='asc'>A to Z</option>
            <option value='desc'>Z to A</option>
          </select>
          <select
            onChange={e => handleSortRating(e)}
            className={styles.selector}
          >
            <option disabled>Rating order</option>
            <option value='worst'>Worst to best</option>
            <option value='best'>Best to worst</option>
          </select>
          <select
            onChange={e => handleFilterGenre(e)}
            className={styles.selector}
          >
            <option disabled>Genre filter</option>
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
          <select
            onChange={e => handleFilterCreated(e)}
            className={styles.selector}
          >
            <option disabled>Status filter</option>
            <option value='All'>All</option>
            <option value='Existing'>Exisisting</option>
            <option value='Created'>Created</option>
          </select>

          <SearchBar />
        </div>
      </div>
      <Paginado
        vgPerPage={vgPerPage}
        allVideogames={allVideogames}
        paginado={paginado}
      />
      <div className={styles.cardContainer}>
        {currentVgs.length > 0 ? (
          currentVgs.map(e => {
            return (
              <Link to={'/home/' + e.id}>
                <VgCard
                  name={e.name}
                  image={e.image.length > 0 ? e.image : img}
                  genre={e.genres.map(e => e.name + '  ')}
                />
              </Link>
            )
          })
        ) : (
          <div className={styles.loading}>
            <div className={styles.loader}>
              <svg viewBox='0 0 80 80'>
                <circle id='test' cx='40' cy='40' r='32'></circle>
              </svg>
            </div>

            <div className={`${styles.loader} ${styles.triangle}`}>
              <svg viewBox='0 0 86 80'>
                <polygon points='43 8 79 72 7 72'></polygon>
              </svg>
            </div>

            <div className={styles.loader}>
              <svg viewBox='0 0 80 80'>
                <rect x='8' y='8' width='64' height='64'></rect>
              </svg>
            </div>
          </div>
        )}
      </div>
      <Paginado
        vgPerPage={vgPerPage}
        allVideogames={allVideogames}
        paginado={paginado}
        className={styles.pagBottom}
      />
    </div>
  )
}
