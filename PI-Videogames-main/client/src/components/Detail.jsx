import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDetail } from '../actions'
import { useEffect } from 'react'
import img from '../Imagenes/mario3d.png'
import styles from './Detail.module.css'
import bgImg from '../Imagenes/jonathan-borba-ipmc5-Z-uwQ-unsplashLQ.jpg'

export default function Detail() {
  const dispatch = useDispatch()
  const { id } = useParams()

  const myVideogame = useSelector(state => state.detail)
  console.log(myVideogame)

  useEffect(() => {
    dispatch(getDetail(id))
  }, [])

  return (
    <div className={styles.bg}>
      <div className={styles.nav}>
        <Link to='/home'>
          <button className={styles.botonBack}>
            <img src={bgImg} className={styles.bgImg} alt='bg' />
          </button>
        </Link>
      </div>
      <div>
        {myVideogame ? (
          <div className={styles.container}>
            <img
              src={myVideogame.image ? myVideogame.image : img}
              alt='Videojuego imagen'
              className={styles.img}
            />
            <h1 className={styles.title}>{myVideogame.name}</h1>
            <div className={styles.rr}>
              <div className={styles.releaseDiv}>
                <p className={styles.release}>{myVideogame.released}</p>
              </div>
              <div className={styles.ratingDiv}>
                <p className={styles.rating}>{myVideogame.rating}</p>
              </div>
            </div>
            <div id={styles['description']}>
              <h3>About: </h3>
              <div
                dangerouslySetInnerHTML={{ __html: myVideogame.description }}
                id={styles['description']}
              />
            </div>
            <div className={styles.genYPlat}>
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
          </div>
        ) : (
          <p>loading...</p>
        )}
      </div>
    </div>
  )
}
