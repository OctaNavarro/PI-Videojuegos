import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDetail } from '../actions'
import { useEffect } from 'react'
import img from '../Imagenes/mario3d.png'

export default function Detail() {
  const dispatch = useDispatch()
  const { id } = useParams()

  const myVideogame = useSelector(state => state.detail)
  console.log(myVideogame)

  useEffect(() => {
    dispatch(getDetail(id))
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
          <h3 >About: </h3>
          <div dangerouslySetInnerHTML={{__html: myVideogame.description}}/>
          
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
