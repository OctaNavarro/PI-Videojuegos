import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDetalle } from '../actions'
import { useEffect } from 'react'
import img from '../Imagenes/mario3d.png'
const imgUrl =
  'https://w7.pngwing.com/pngs/537/580/png-transparent-super-mario-3d-land-super-mario-3d-world-new-super-mario-bros-super-mario-64-mario-heroes-nintendo-video-game.png'


export default function Detail() {
  const dispatch = useDispatch()
  const { id } = useParams()

  const myVideogame = useSelector(state => state.detail)
  console.log(myVideogame)

  useEffect(() => {
    dispatch(getDetalle(id))
  }, [])

  return (
    <div>
      {myVideogame ? (
        <div>
          <h1>{myVideogame.name}</h1>
          <img
            src={myVideogame.image ? myVideogame.image : img}
            alt='Videojuego imagen'
            width='400px'
            height='500px'
          />
          <h2>Rating: {myVideogame.rating}</h2>
          <h2>Release date: {myVideogame.released}</h2>
          <h2>About: {myVideogame.description}</h2>
          <h3>
            Genres:{' '}
            {!myVideogame.createdInDb
              ? myVideogame.genres + ' '
              : myVideogame.genres.map(e => e.name + ' ')}
          </h3>
          <h3>
            Platforms available:{' '}
            {!myVideogame.createdInDb
              ? myVideogame.platforms + ' '
              : myVideogame.platforms.map(e => e.name + ' ')}
          </h3>
        </div>
      ) : (
        <p>loading...</p>
      )}
      <Link to='/home'>Back</Link>
    </div>
  )
}
