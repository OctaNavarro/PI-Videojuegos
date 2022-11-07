import React from 'react'
import { Link } from 'react-router-dom'
import landingImg from '../Imagenes/videogames.gif'
import styles from './LandingPage.module.css'
import controlImg from '../Imagenes/Write-for-Video-Games-scaled.jpg'

export default function LandingPage() {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <img src={landingImg} alt='landing' className={styles.btnImg} />
        <Link to='/home'>
          <button type='button' className={styles.btn}>
            <img src={controlImg} className={styles.ctrImg} alt='ctr' />
          </button>
        </Link>
      </div>
    </div>
  )
}
